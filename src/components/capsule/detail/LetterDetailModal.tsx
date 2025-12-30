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
  Heart,
  LinkIcon,
  MessageSquareWarning,
  MoreHorizontal,
  MapPin,
  PencilLine,
  Reply,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActiveModal from "@/components/common/ActiveModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import {
  deleteCapsuleAsReceiver,
  deleteCapsuleAsSender,
  getCapsuleLikeCount,
  likeCapsule,
  unlikeCapsule,
} from "@/lib/api/capsule/capsule";
import { formatDate } from "@/lib/hooks/formatDate";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { CAPTURE_COLOR_MAP } from "@/constants/capsulePalette";

type UnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";

export type UICapsule = {
  capsuleColor?: string;
  title: string;
  content: string;
  createdAt: string;
  writerNickname: string;
  recipient: string | null;

  unlockType: UnlockType;
  unlockAt: string | null;
  unlockUntil?: string | null;

  locationName: string | null;

  // send에서 상대방 열람 여부로 수정 제한하려면 필요
  viewStatus?: boolean;

  // 어드민은 필요x
  isBookmarked?: boolean;
};

type PostLoginAction =
  | {
      type: "SAVE_CAPSULE";
      payload: { capsuleId: number; isSendSelf: 0 | 1 };
    }
  | {
      type: "TOGGLE_BOOKMARK";
      payload: { capsuleId: number; nextBookmarked: boolean };
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
  isProtected = 1,
  role = "USER",
  onClose,
  locationLat = null,
  locationLng = null,
  password = null,
  initialData = null,
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
  initialData?: UICapsule | null; // LetterDetailView에서 이미 가져온 데이터
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const isAdmin = role === "ADMIN";

  /* 저장 */
  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);

  /* 북마크 */
  const [bookmarkToast, setBookmarkToast] = useState<{
    open: boolean;
    mode: "ADD" | "REMOVE";
  }>({ open: false, mode: "ADD" });

  /* 삭제 */
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 북마크
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  // 저장 mutation (공개 편지 저장하기)
  const saveMutation = useMutation({
    mutationKey: ["capsuleSave", capsuleId],
    mutationFn: (payload: {
      capsuleId: number;
      isSendSelf: 0 | 1;
      unlockAt: string;
    }) => guestCapsuleApi.save(payload),
    onSuccess: () => setIsSaveSuccessOpen(true),
  });

  // 북마크 토글 mutation
  const bookmarkMutation = useMutation({
    mutationKey: ["capsuleBookmarkToggle", capsuleId],
    mutationFn: async (nextBookmarked: boolean) => {
      // nextBookmarked === true -> add
      if (nextBookmarked) return capsuleDashboardApi.addBookmark(capsuleId);
      return capsuleDashboardApi.removeBookmark(capsuleId);
    },
    onMutate: async (nextBookmarked: boolean) => {
      const prev = isBookmarked;
      setIsBookmarked(nextBookmarked);
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev != null) setIsBookmarked(ctx.prev);

      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "북마크 처리 중 오류가 발생했습니다.";
      alert(msg);
    },
    onSuccess: (_data, nextBookmarked) => {
      // 목록/상세 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["capsuleDetailModal"] });
      queryClient.invalidateQueries({ queryKey: ["capsuleDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      setBookmarkToast({
        open: true,
        mode: nextBookmarked ? "ADD" : "REMOVE",
      });
    },
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
      setIsDeleteSuccessOpen(true);
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

  // 좋아요 수 조회 query (공개 편지일 때만)
  const { data: likeData } = useQuery({
    queryKey: ["capsuleLikeCount", capsuleId],
    enabled: isPublic && open && capsuleId > 0,
    queryFn: async () => {
      const res = await getCapsuleLikeCount(capsuleId);
      return res.data;
    },
  });

  // 좋아요 수 초기화
  useEffect(() => {
    if (likeData) {
      setLikeCount(likeData.likeCount);
    }
  }, [likeData]);

  // 좋아요 토글 mutation (낙관적 업데이트)
  const likeMutation = useMutation({
    mutationKey: ["capsuleLike", capsuleId],
    mutationFn: async (shouldLike: boolean) => {
      if (shouldLike) return await likeCapsule(capsuleId);
      return await unlikeCapsule(capsuleId);
    },
    onMutate: async () => {
      const previousIsLiked = isLiked;
      const previousLikeCount = likeCount;
      const nextIsLiked = !previousIsLiked;

      setIsLiked(nextIsLiked);
      setLikeCount((prev) => (previousIsLiked ? prev - 1 : prev + 1));

      return { previousIsLiked, previousLikeCount, nextIsLiked };
    },
    onSuccess: (data, _variables, context) => {
      if (data.data) setLikeCount(data.data.likeCount);
      if (context) setIsLiked(context.nextIsLiked);
    },
    onError: (err, _variables, context) => {
      const errorCode =
        err && typeof err === "object" && "code" in err
          ? (err as { code?: string }).code
          : null;

      if (errorCode === "CPS016") {
        setIsLiked(true);
        return;
      }
      if (errorCode === "CPS018") {
        setIsLiked(false);
        return;
      }
      if (context) {
        setIsLiked(context.previousIsLiked);
        setLikeCount(context.previousLikeCount);
      }

      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "좋아요 처리 중 오류가 발생했습니다.";
      alert(msg);
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

    if (action.type === "TOGGLE_BOOKMARK") {
      bookmarkMutation.mutate(action.payload.nextBookmarked);
      return;
    }
  }, [open, saveMutation, bookmarkMutation]);

  // 저장 버튼 핸들러 (공개 편지 저장하기)
  const handleSave = async () => {
    try {
      const me = await authApiClient.me();
      console.log("me:", me);
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

      console.error("save error:", err);
    }
  };

  // 북마크 버튼 핸들러
  const handleToggleBookmark = async () => {
    const next = !isBookmarked;

    try {
      const me = await authApiClient.me();
      if (!me) throw Object.assign(new Error("NO_ME"), { status: 401 });

      bookmarkMutation.mutate(next);
    } catch (err: any) {
      if (isAuthMissingError(err)) {
        const action: PostLoginAction = {
          type: "TOGGLE_BOOKMARK",
          payload: { capsuleId, nextBookmarked: next },
        };
        sessionStorage.setItem(POST_LOGIN_ACTION_KEY, JSON.stringify(action));
        router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        return;
      }

      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "북마크 처리 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  // 상세 조회 query (open일 때만)
  // initialData가 있으면 API 호출하지 않음 (중복 요청 방지)
  const { data, isLoading, isError, error } = useQuery<UICapsule>({
    queryKey: ["capsuleDetailModal", role, capsuleId, password, isSender],
    enabled: open && capsuleId > 0 && !initialData,
    retry: false,
    queryFn: async ({ signal }) => {
      // 1) 관리자 상세
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

          viewStatus: (a.data as any).viewStatus,
          isBookmarked: false,
        };
      }

      // 2) 보낸 편지 상세
      if (isSender) {
        const s: CapsuleDashboardSendItem =
          await capsuleDashboardApi.readSendCapsule(capsuleId, signal);
        return {
          capsuleColor: s.capsuleColor ?? null,
          title: s.title,
          content: s.content,
          createdAt: s.createdAt,
          writerNickname: s.senderNickname,
          recipient: s.recipient ?? null,

          unlockType: s.unlockType,
          unlockAt: s.unlockAt,
          unlockUntil: s.unlockUntil,

          locationName: s.locationName ?? null,

          viewStatus: !!s.viewStatus,
          isBookmarked: !!s.isBookmarked,
        };
      }

      // 3) 받은/공개 편지 상세
      const unlockAt = new Date().toISOString();
      const pos =
        locationLat != null && locationLng != null
          ? { lat: locationLat, lng: locationLng }
          : await getCurrentPos();

      const u: CapsuleReadData = await guestCapsuleApi.read(
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
        capsuleColor: u.capsuleColor ?? null,
        title: u.title,
        content: u.content,
        createdAt: u.createdAt,
        writerNickname: u.senderNickname,
        recipient: u.recipient ?? null,

        unlockType: u.unlockType,
        unlockAt: u.unlockAt,
        unlockUntil: u.unlockUntil,

        locationName: u.locationName ?? null,

        viewStatus: !!u.viewStatus,
        isBookmarked: !!u.isBookmarked,
      };
    },
  });

  useEffect(() => {
    if (!open) return;
    setIsBookmarked(!!(initialData?.isBookmarked ?? data?.isBookmarked));
  }, [open, initialData?.isBookmarked, data?.isBookmarked]);

  // open이 아니면 렌더 자체 안 함
  if (!open) return null;

  // initialData가 있으면 바로 사용, 없으면 useQuery 결과 사용
  const capsuleData = initialData ?? data;

  if (!initialData && isLoading) {
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

  if (!capsuleData) {
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

  const capsule = capsuleData;

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

  const DEFAULT_HEX = CAPTURE_COLOR_MAP.BEIGE ?? "#FFDED8";

  const detailKey = (capsule.capsuleColor ?? "BEIGE")
    .toString()
    .trim()
    .toUpperCase() as keyof typeof CAPTURE_COLOR_MAP;

  const detailHex = CAPTURE_COLOR_MAP[detailKey] ?? DEFAULT_HEX;

  // Footer에서 북마크 버튼을 보여줄지:
  // - 관리자면 없음
  // - 보호편지(= 북마크 모드)일 때는 북마크 토글
  const isBookmarkMode = !isAdmin && !!isProtected;

  const bookmarkButtonDisabled = bookmarkMutation.isPending;

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

      {/* 북마크 성공 모달 */}
      {bookmarkToast.open && (
        <ActiveModal
          active="success"
          title={bookmarkToast.mode === "ADD" ? "북마크 완료" : "북마크 해제"}
          content={
            bookmarkToast.mode === "ADD"
              ? "북마크가 완료되었습니다."
              : "북마크가 해제되었습니다."
          }
          open={bookmarkToast.open}
          onClose={() => setBookmarkToast((prev) => ({ ...prev, open: false }))}
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

      {/* 삭제 성공 모달 */}
      {isDeleteSuccessOpen && (
        <ActiveModal
          active="success"
          title="삭제 완료"
          content="캡슐이 삭제되었습니다."
          open={isDeleteSuccessOpen}
          onClose={() => setIsDeleteSuccessOpen(false)}
          onConfirm={() => {
            setIsDeleteSuccessOpen(false);
            if (closeHref) router.push(closeHref);
            else router.back();
            router.refresh();
          }}
        />
      )}

      <div className="flex h-full justify-center md:p-15 p-6">
        <div className="flex flex-col max-w-300 w-full h-[calc(100vh-48px)] md:h-[calc(100vh-120px)] bg-white rounded-2xl">
          {/* Header */}
          <div className="shrink-0 border-b px-8 py-4 border-outline">
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
                {isSender || isReceiver ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-primary"
                        aria-label="더보기"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 z-10000 bg-white shadow-lg"
                    >
                      <DropdownMenuLabel>관리</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {isSender && (
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(
                                `/capsules/edit?capsuleId=${capsuleId}`
                              );
                            }}
                          >
                            <PencilLine className="text-primary" />
                            수정하기
                          </DropdownMenuItem>
                        )}
                        {(isSender || isReceiver) && (
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => setIsDeleteConfirmOpen(true)}
                          >
                            <Trash2 className="text-primary" />
                            삭제하기
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
            <div
              className="w-full h-full py-15 px-15"
              style={{ backgroundColor: detailHex }}
            >
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
          <div className="shrink-0 border-t border-outline p-5">
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
                      className="cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      onClick={() => likeMutation.mutate(!isLiked)}
                      disabled={likeMutation.isPending}
                    >
                      <Heart
                        size={16}
                        className={
                          isLiked ? "text-primary fill-red-500" : "text-primary"
                        }
                      />
                      <span>
                        {likeMutation.isPending
                          ? "처리 중..."
                          : `좋아요 ${likeCount}`}
                      </span>
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

                {/* ✅ 저장하기(공개) vs 북마크(보호) 분기 */}
                <div className="flex-1 flex items-center justify-center">
                  {isBookmarkMode ? (
                    <button
                      onClick={handleToggleBookmark}
                      type="button"
                      className="cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      disabled={bookmarkButtonDisabled}
                    >
                      <Bookmark
                        size={16}
                        className={
                          isBookmarked
                            ? "text-primary fill-primary"
                            : "text-primary"
                        }
                      />
                      <span>
                        {bookmarkButtonDisabled
                          ? "처리 중..."
                          : isBookmarked
                          ? "북마크 해제"
                          : "북마크"}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      type="button"
                      className="cursor-pointer flex items-center justify-center gap-2"
                      disabled={saveMutation.isPending}
                    >
                      <Archive size={16} className="text-primary" />
                      <span>
                        {saveMutation.isPending ? "저장 중..." : "저장하기"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
