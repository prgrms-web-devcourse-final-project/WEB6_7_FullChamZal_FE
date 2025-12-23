/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  Archive,
  Bookmark,
  Clock,
  Heart,
  LinkIcon,
  MessageSquareWarning,
  MoreHorizontal,
  MapPin,
  Reply,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ActiveModal from "@/components/common/ActiveModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import {
  deleteCapsuleAsReceiver,
  deleteCapsuleAsSender,
} from "@/lib/api/capsule/capsule";
import { formatDate } from "@/lib/hooks/formatDate";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { useMe } from "@/lib/hooks/useMe";

type UICapsule = {
  title: string;
  content: string;
  createdAt: string;
  writerNickname: string;
  recipient: string | null;

  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION" | string;
  unlockAt: string | null;
  unlockUntil?: string | null;

  locationName: string | null;
};

type PostLoginAction = {
  type: "SAVE_CAPSULE";
  payload: { capsuleId: number; isSendSelf: 0 | 1 };
};

const POST_LOGIN_ACTION_KEY = "postLoginAction";

function isAuthMissingError(err: any) {
  const status = err?.status ?? err?.response?.status;
  return status === 401 || status === 403;
}

async function getCurrentPos() {
  return await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if (!navigator.geolocation)
      reject(new Error("위치 정보를 사용할 수 없습니다."));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      reject,
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  });
}

export default function LetterDetailModal({
  capsuleId,
  open = true,
  closeHref,
  isProtected,
  role = "USER",
  onClose,
  locationLat = null,
  locationLng = null,
  password = null,
}: {
  uuId?: string;
  capsuleId: number;
  open?: boolean;
  closeHref?: string;
  isProtected?: number;
  role?: MemberRole;
  onClose?: () => void;

  locationLat?: number | null;
  locationLng?: number | null;
  password?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdmin = role === "ADMIN";
  const meQuery = useMe();

  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 발신자/수신자/공개 편지 구분: pathname으로 확인
  const isSender = pathname?.includes("/dashboard/send");
  const isReceiver = pathname?.includes("/dashboard/receive");
  const isPublic = pathname?.includes("/dashboard/map");

  const returnUrl = useMemo(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : `${pathname}`;
  }, [pathname, searchParams]);

  const close = () => {
    if (role === "ADMIN") {
      onClose?.();
      return;
    }
    if (closeHref) router.push(closeHref, { scroll: false });
    else router.back();
  };

  // ✅ 저장 mutation
  const saveMutation = useMutation({
    mutationKey: ["capsuleSave", capsuleId],
    mutationFn: (payload: {
      capsuleId: number;
      isSendSelf: 0 | 1;
      unlockAt: string;
    }) => guestCapsuleApi.save(payload),
    onSuccess: () => setIsSaveSuccessOpen(true),
  });

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationKey: ["capsuleDelete", capsuleId],
    mutationFn: () => {
      if (isSender) {
        return deleteCapsuleAsSender(capsuleId);
      } else if (isReceiver) {
        return deleteCapsuleAsReceiver(capsuleId);
      }
      throw new Error("삭제할 수 없습니다.");
    },
    onSuccess: () => {
      alert("캡슐이 삭제되었습니다.");
      if (closeHref) {
        router.push(closeHref);
      } else {
        router.back();
      }
      router.refresh();
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "삭제 중 오류가 발생했습니다.";
      alert(msg);
    },
  });

  // ✅ 로그인/회원가입 후 돌아왔을 때 자동 재시도
  useEffect(() => {
    if (!open) return;

    const raw = sessionStorage.getItem(POST_LOGIN_ACTION_KEY);
    if (!raw) return;

    sessionStorage.removeItem(POST_LOGIN_ACTION_KEY); // 🔥 일단 제거 (무한루프 방지)

    let action: PostLoginAction | null = null;
    try {
      action = JSON.parse(raw);
    } catch {
      return;
    }

    if (action?.type !== "SAVE_CAPSULE") return;

    const unlockAt = new Date().toISOString();
    saveMutation.mutate({
      capsuleId: action.payload.capsuleId,
      isSendSelf: action.payload.isSendSelf,
      unlockAt,
    });
  }, [open, saveMutation]);

  // ✅ 저장 버튼 핸들러
  const handleSave = async () => {
    try {
      const me = await authApiClient.me();
      if (!me) throw Object.assign(new Error("NO_ME"), { status: 401 });

      const unlockAt = new Date().toISOString();
      saveMutation.mutate({ capsuleId, isSendSelf: 0, unlockAt });
    } catch (err: any) {
      if (isAuthMissingError(err)) {
        const action: PostLoginAction = {
          type: "SAVE_CAPSULE",
          payload: { capsuleId, isSendSelf: 0 },
        };
        sessionStorage.setItem(POST_LOGIN_ACTION_KEY, JSON.stringify(action));

        router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        return;
      }

      console.error("❌ save error:", err);
    }
  };

  // ✅ 상세 조회 query (open일 때만)
  const { data, isLoading, isError, error } = useQuery<UICapsule>({
    queryKey: ["capsuleDetailModal", role, capsuleId, password],
    enabled: open && capsuleId > 0,
    retry: false,
    queryFn: async ({ signal }) => {
      if (isAdmin) {
        const a = await adminCapsulesApi.detail({ capsuleId, signal });
        return {
          title: a.data.title,
          content: a.data.content,
          createdAt: a.data.createdAt,
          writerNickname: a.data.writerNickname,
          recipient: a.data.recipientName ?? null,

          unlockType: a.data.unlockType,
          unlockAt: a.data.unlockAt,
          unlockUntil: a.data.unlockUntil ?? null,

          locationName: a.data.locationAlias || a.data.address || null,
        };
      }

      const unlockAt = new Date().toISOString();
      const pos =
        locationLat != null && locationLng != null
          ? { lat: locationLat, lng: locationLng }
          : await getCurrentPos();

      const u = await guestCapsuleApi.read(
        {
          capsuleId,
          unlockAt,
          locationLat: pos.lat ?? 0,
          locationLng: pos.lng ?? 0,
          password,
        },
        signal
      );

      return {
        title: u.title,
        content: u.content,
        createdAt: u.createAt,
        writerNickname: u.senderNickname,
        recipient: u.recipient ?? null,

        unlockType: u.unlockType,
        unlockAt: u.unlockAt,
        unlockUntil: u.unlockUntil,

        locationName: u.locationName ?? null,
      };
    },
  });

  // ✅ open이 아니면 렌더 자체 안 함 (훅은 이미 호출된 뒤라 안전)
  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-9999 bg-black/50">
        <div className="flex h-full justify-center py-15">
          <div className="max-w-330 w-full rounded-2xl bg-white p-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">불러오는 중...</div>
              <button onClick={close} className="cursor-pointer text-primary">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 z-9999 bg-black/50">
        <div className="flex h-full justify-center py-15">
          <div className="max-w-330 w-full rounded-2xl bg-white p-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">불러오기 실패</div>
              <button onClick={close} className="cursor-pointer text-primary">
                <X size={24} />
              </button>
            </div>

            <pre className="mt-4 text-xs whitespace-pre-wrap">
              {String((error as any)?.message ?? error)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-9999 bg-black/50">
        <div className="flex h-full justify-center py-15">
          <div className="max-w-330 w-full rounded-2xl bg-white p-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">편지를 찾을 수 없어요</div>
              <button onClick={close} className="cursor-pointer text-primary">
                <X size={24} />
              </button>
            </div>
            <p className="h-full mt-4 text-text-3 flex items-center justify-center">
              해당 편지에 대한 내용이 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const capsule = data;
  // 내가 보낸 편지만 수정 가능하기에, 임시로 확인을 하기 위함임
  // 백엔드 측에 별도 API 요청하여 구현 필요
  const me = meQuery.data;
  const isOwner =
    !isAdmin &&
    !!me &&
    (me.nickname === capsule.writerNickname ||
      me.name === capsule.writerNickname);

  const isTime =
    capsule.unlockType === "TIME" || capsule.unlockType === "TIME_AND_LOCATION";

  const unlockLabel =
    capsule.unlockType === "TIME"
      ? capsule.unlockAt
        ? formatDateTime(capsule.unlockAt)
        : "시간 조건 없음"
      : capsule.unlockType === "LOCATION"
      ? capsule.locationName ?? "위치 조건 없음"
      : `${
          capsule.unlockAt ? formatDateTime(capsule.unlockAt) : "시간 조건 없음"
        } · ${capsule.locationName ?? "위치 조건 없음"}`;

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 w-full min-h-screen">
      {/* 저장 성공 모달 */}
      {isSaveSuccessOpen && (
        <ActiveModal
          active="success"
          title="저장 완료"
          content="저장이 완료되었습니다."
          open={isSaveSuccessOpen}
          onClose={() => setIsSaveSuccessOpen(false)}
          onConfirm={() => {
            setIsSaveSuccessOpen(false);
            router.replace("/dashboard");
            router.refresh();
          }}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <ConfirmModal
          active="fail"
          title="캡슐 삭제"
          content={
            isSender
              ? "보낸 편지를 삭제하시겠습니까?"
              : "받은 편지를 삭제하시겠습니까?"
          }
          open={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={() => {
            setIsDeleteConfirmOpen(false);
            deleteMutation.mutate();
          }}
        />
      )}

      <div className="flex h-full justify-center md:p-15 p-6">
        <div className="flex flex-col max-w-300 w-full h-[calc(100vh-48px)] md:h-[calc(100vh-120px)] bg-white rounded-2xl">
          {/* Header */}
          <div className="shrink-0 border-b px-8 py-4">
            <div className="flex justify-between items-center gap-4">
              <div className="md:flex-1 truncate">{capsule.title}</div>

              <div
                className={`flex-1 flex items-center gap-1 ${
                  isProtected ? "justify-end" : "justify-center"
                }`}
              >
                <span className="hidden md:block text-text-2">해제 조건:</span>
                <div className="flex items-center gap-1 text-text-3">
                  {isTime ? <Clock size={16} /> : <MapPin size={16} />}
                  <span className="line-clamp-1">{unlockLabel}</span>
                </div>
              </div>

              <div className="md:flex-1 flex justify-end items-center gap-2">
                {isOwner || isSender || isReceiver ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-primary"
                        aria-label="더보기"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-44 z-10000 p-1"
                      sideOffset={6}
                    >
                      <div className="px-3 py-2 text-xs text-text-3">관리</div>
                      <div className="h-px bg-border my-1" />
                      {isOwner && (
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent text-text-2 rounded-md"
                          onClick={() => {
                            router.push(
                              `/capsules/edit?capsuleId=${capsuleId}`
                            );
                          }}
                        >
                          수정하기
                        </button>
                      )}
                      {(isSender || isReceiver) && (
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent text-text-2 rounded-md disabled:opacity-60"
                          disabled={deleteMutation.isPending}
                          onClick={() => setIsDeleteConfirmOpen(true)}
                        >
                          {deleteMutation.isPending ? "삭제 중..." : "삭제하기"}
                        </button>
                      )}
                    </PopoverContent>
                  </Popover>
                ) : null}

                <button
                  type="button"
                  className="cursor-pointer text-primary"
                  onClick={close}
                  aria-label="닫기"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden">
            <div className="w-full h-full py-15 px-15">
              <div className="w-full h-full flex flex-col justify-between gap-8">
                <div className="text-2xl space-x-1">
                  <span className="text-primary font-bold">Dear.</span>
                  <span>{capsule.recipient ?? "(수신자 정보 없음)"}</span>
                </div>

                <div className="flex-1 mx-3 overflow-x-hidden overflow-y-auto">
                  <pre className="whitespace-pre-wrap wrap-break-word text-lg">
                    {capsule.content}
                  </pre>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="text-text-3">
                    {formatDate(capsule.createdAt)}
                  </span>
                  <div className="text-2xl space-x-1">
                    <span className="text-primary font-bold">From.</span>
                    <span>{capsule.writerNickname}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t p-5">
            {role === "ADMIN" ? null : (
              <div className="flex-1 flex items-center justify-center">
                {isReceiver && (
                  <div className="flex-1 flex items-center justify-center">
                    <button
                      type="button"
                      className="cursor-pointer flex items-center justify-center gap-2"
                    >
                      <MessageSquareWarning
                        size={16}
                        className="text-primary"
                      />
                      <span>신고하기</span>
                    </button>
                  </div>
                )}

                <div className="flex-1 flex items-center justify-center">
                  <button
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LinkIcon size={16} className="text-primary" />
                    <span>링크 복사</span>
                  </button>
                </div>

                {isPublic && (
                  <div className="flex-1 flex items-center justify-center">
                    <button
                      type="button"
                      className="cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart size={16} className="text-primary" />
                      <span>좋아요</span>
                    </button>
                  </div>
                )}

                {!isPublic && (
                  <div className="flex-1 flex items-center justify-center">
                    <Link
                      href={"/capsules/new"}
                      className="flex items-center justify-center gap-2"
                    >
                      <Reply size={16} className="text-primary" />
                      <span>답장하기</span>
                    </Link>
                  </div>
                )}

                <div className="flex-1 flex items-center justify-center">
                  <button
                    onClick={handleSave}
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                    disabled={saveMutation.isPending}
                  >
                    {!isProtected ? (
                      <>
                        <Archive size={16} className="text-primary" />
                        <span>
                          {saveMutation.isPending ? "저장 중..." : "저장하기"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} className="text-primary" />
                        <span>
                          {saveMutation.isPending ? "처리 중..." : "북마크"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
