/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Archive,
  Bookmark,
  Clock,
  LinkIcon,
  MapPin,
  Reply,
  X,
} from "lucide-react";

import ActiveModal from "@/components/common/ActiveModal";
import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import { formatDate } from "@/lib/hooks/formatDate";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { bookmarkApi } from "@/lib/api/dashboard/bookmark";

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

type PostLoginAction =
  | { type: "SAVE_CAPSULE"; payload: { capsuleId: number; isSendSelf: 0 | 1 } }
  | { type: "BOOKMARK"; payload: { capsuleId: number } };

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
  const queryClient = useQueryClient();

  const isAdmin = role === "ADMIN";

  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);

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

  // 저장 mutation
  const saveMutation = useMutation({
    mutationKey: ["capsuleSave", capsuleId],
    mutationFn: (payload: {
      capsuleId: number;
      isSendSelf: 0 | 1;
      unlockAt: string;
    }) => guestCapsuleApi.save(payload),
    onSuccess: () => setIsSaveSuccessOpen(true),
  });

  // 북마크 추가/복구
  const bookmarkMutation = useMutation({
    mutationKey: ["bookmarkUpsert", capsuleId],
    mutationFn: (payload: { capsuleId: number }) => bookmarkApi.upsert(payload),
    onSuccess: () => {
      // 북마크 리스트/카운트 갱신
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      // 필요하면 대시보드 숫자도 갱신(북마크 카운트 쓰는 곳)
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "count"] });
    },
  });

  // 북마크 삭제
  const removeBookmarkMutation = useMutation({
    mutationKey: ["bookmarkRemove", capsuleId],
    mutationFn: (id: number) => bookmarkApi.remove(id),
    onSuccess: () => {
      // 북마크 리스트/카운트 갱신
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "count"] });
    },
  });

  // 로그인/회원가입 후 돌아왔을 때 자동 재시도
  useEffect(() => {
    if (!open) return;

    const raw = sessionStorage.getItem(POST_LOGIN_ACTION_KEY);
    if (!raw) return;

    sessionStorage.removeItem(POST_LOGIN_ACTION_KEY);

    let action: PostLoginAction | null = null;
    try {
      action = JSON.parse(raw);
    } catch {
      return;
    }

    if (!action) return;

    if (action.type === "SAVE_CAPSULE") {
      const unlockAt = new Date().toISOString();
      saveMutation.mutate({
        capsuleId: action.payload.capsuleId,
        isSendSelf: action.payload.isSendSelf,
        unlockAt,
      });
      return;
    }

    if (action.type === "BOOKMARK") {
      bookmarkMutation.mutate({ capsuleId: action.payload.capsuleId });
      return;
    }
  }, [open, saveMutation, bookmarkMutation]);

  // 저장 버튼 핸들러
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

  // 북마크 핸들러
  const handleBookmark = async () => {
    try {
      const me = await authApiClient.me();
      if (!me) throw Object.assign(new Error("NO_ME"), { status: 401 });

      // 북마크 화면에서는 제거, 그 외에는 추가
      if (isProtected) {
        removeBookmarkMutation.mutate(capsuleId);
      } else {
        bookmarkMutation.mutate({ capsuleId });
      }
    } catch (err: any) {
      if (isAuthMissingError(err)) {
        const action: PostLoginAction = {
          type: "BOOKMARK",
          payload: { capsuleId },
        };
        sessionStorage.setItem(POST_LOGIN_ACTION_KEY, JSON.stringify(action));
        router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        return;
      }

      console.error("❌ bookmark error:", err);
    }
  };

  // 상세 조회 query (open일 때만)
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

  // open이 아니면 렌더 자체 안 함 (훅은 이미 호출된 뒤라 안전)
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

              <div className="md:flex-1 flex justify-end">
                <button
                  type="button"
                  className="cursor-pointer text-primary"
                  onClick={close}
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
                <div className="flex-1 flex items-center justify-center">
                  <button
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LinkIcon size={16} className="text-primary" />
                    <span>링크 복사</span>
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <Link
                    href={"/capsules/new"}
                    className="flex items-center justify-center gap-2"
                  >
                    <Reply size={16} className="text-primary" />
                    <span>답장하기</span>
                  </Link>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <button
                    onClick={!isProtected ? handleSave : handleBookmark}
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                    disabled={
                      saveMutation.isPending ||
                      bookmarkMutation.isPending ||
                      removeBookmarkMutation.isPending
                    }
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
                          {bookmarkMutation.isPending ||
                          removeBookmarkMutation.isPending
                            ? "처리 중..."
                            : "북마크 해제"}
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
