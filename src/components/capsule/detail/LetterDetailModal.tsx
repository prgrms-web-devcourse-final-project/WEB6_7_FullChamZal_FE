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
  MessageSquareWarning,
  MoreHorizontal,
  MapPin,
  PencilLine,
  Reply,
  Trash2,
  X,
  Download,
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
import ActiveModal from "@/components/common/modal/ActiveModal";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import {
  backupCapsule,
  deleteCapsuleAsReceiver,
  deleteCapsuleAsSender,
  getCapsuleLikeCount,
  likeCapsule,
  unlikeCapsule,
} from "@/lib/api/capsule/capsule";
import { formatDate } from "@/lib/hooks/formatDate";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { CAPTURE_COLOR_MAP } from "@/lib/constants/capsulePalette";
import ReportModal from "../report/ReportModal";
import toast from "react-hot-toast";
import Image from "next/image";

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

  // 첨부 이미지 목록
  attachments?: Array<{
    presignedUrl: string;
    attachmentId: number;
  }>;
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

  /* 신고 */
  const [isReportOpen, setIsReportOpen] = useState(false);

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

  // 백업
  const [isBackupSuccessOpen, setIsBackupSuccessOpen] = useState(false);

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeToast, setLikeToast] = useState<{
    open: boolean;
    mode: "ADD" | "REMOVE";
  }>({ open: false, mode: "ADD" });

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
      toast.error(msg);
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
      queryClient.invalidateQueries({ queryKey: ["capsuleDetailModal"] });
      queryClient.invalidateQueries({ queryKey: ["capsuleDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      setIsDeleteSuccessOpen(true);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "삭제 중 오류가 발생했습니다.";
      toast.error(msg);
    },
  });

  //백업 mutation
  const backupMutation = useMutation({
    mutationKey: ["capsuleBackup", capsuleId],
    mutationFn: backupCapsule,
    onSuccess: (res) => {
      const url = res.data.authUrl;
      if (res.data.status === "NEED_CONNECT") {
        window.open(url, "_blank");
        return;
      }
      setIsBackupSuccessOpen(true);
    },
    onError: (err) => {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "백업 중 오류가 발생했습니다.";
      toast.error(msg);
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

  // 좋아요 수 및 상태 초기화
  useEffect(() => {
    if (likeData) {
      setLikeCount(likeData.capsuleLikeCount);
      // isLiked가 있으면 초기 상태 설정 (readLike API 응답에 포함됨)
      if (typeof likeData.isLiked === "boolean") {
        setIsLiked(likeData.isLiked);
      }
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
      if (data.data) setLikeCount(data.data.capsuleLikeCount);
      if (context) {
        setIsLiked(context.nextIsLiked);
        // 좋아요 성공 모달 표시
        setLikeToast({
          open: true,
          mode: context.nextIsLiked ? "ADD" : "REMOVE",
        });
      }
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
      toast.error(msg);
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
      const loggedIn = await authApiClient.isLoggedIn();
      if (!loggedIn) throw Object.assign(new Error("NO_ME"), { status: 401 });

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
      toast.error("저장 중 오류가 발생했습니다.");
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
      toast.error(msg);
    }
  };

  // 공개 편지일 때 "보는 사람" 이름 가져오기
  const { data: viewerName } = useQuery({
    queryKey: ["viewerName"],
    enabled: open && isPublic, // 공개 편지 모달 열렸을 때만
    retry: false,
    queryFn: async () => {
      // 로그인 안 했으면 기본 호칭
      const loggedIn = await authApiClient.isLoggedIn();
      if (!loggedIn) return null;

      const me = await authApiClient.me();
      // 프로젝트 DTO에 맞게 우선순위 정하기
      return (
        (me as any)?.nickname ??
        (me as any)?.name ??
        (me as any)?.userId ??
        null
      );
    },
  });

  // 상세 조회 query (open일 때만)
  // initialData가 있으면 API 호출하지 않음 (중복 요청 방지)
  const { data, isLoading, isError, error } = useQuery<UICapsule>({
    queryKey: ["capsuleDetailModal", role, capsuleId, password, isSender],
    enabled: open && capsuleId > 0 && !initialData,
    retry: false,
    queryFn: async ({ signal }) => {
      // 1) 관리자 상세
      if (isAdmin) {
        const res = await adminCapsulesApi.detail({ capsuleId, signal });

        const payload =
          (res as any)?.data?.data ?? (res as any)?.data ?? (res as any);

        if (!payload) {
          throw new Error("관리자 상세 데이터를 불러오지 못했습니다.");
        }

        return {
          title: payload.title,
          content: payload.content,
          createdAt: payload.createdAt,
          writerNickname: payload.writerNickname,
          recipient: payload.recipientName ?? null,

          unlockType: payload.unlockType,
          unlockAt: payload.unlockAt,
          unlockUntil: payload.unlockUntil ?? null,

          locationName: payload.locationAlias || payload.address || null,

          viewStatus: payload.viewStatus,
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
          attachments: s.attachments,
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
        attachments: u.attachments,
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
  const capsule = initialData ?? data;

  if (!initialData && isLoading) {
    return (
      <div className="fixed inset-0 z-9999 bg-black/50">
        <div className="flex h-full justify-center p-15">
          <div className="max-w-330 w-full rounded-2xl bg-bg p-8">
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
        <div className="flex h-full justify-center p-15">
          <div className="max-w-330 w-full rounded-2xl bg-bg p-8">
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

  if (!capsule) {
    return (
      <div className="fixed inset-0 z-9999 bg-black/50">
        <div className="flex h-full justify-center p-15">
          <div className="max-w-330 w-full rounded-2xl bg-bg p-8">
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

  // 공개 편지이면 보는 사람 이름, 비공개 편지일 경우 받는 사람 이름, 그냥 빈 데이터이면 당신
  const dearName = isPublic
    ? viewerName ?? "당신"
    : capsule.recipient ?? "당신";

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

  const unlockUntilLabel =
    capsule.unlockUntil != null ? formatDateTime(capsule.unlockUntil) : null;

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

      {backupMutation.isPending && (
        <div className="fixed inset-0 z-1000 bg-black/40 flex items-center justify-center">
          <div className="bg-bg rounded-xl px-6 py-4 flex items-center gap-3">
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-2 border-t-transparent" />
            <span className="text-sm font-medium">백업 중...</span>
          </div>
        </div>
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

      {/* 좋아요 성공 모달 */}
      {likeToast.open && (
        <ActiveModal
          active="success"
          title={likeToast.mode === "ADD" ? "좋아요 완료" : "좋아요 취소"}
          content={
            likeToast.mode === "ADD"
              ? "좋아요가 완료되었습니다."
              : "좋아요가 취소되었습니다."
          }
          open={likeToast.open}
          onClose={() => setLikeToast((prev) => ({ ...prev, open: false }))}
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
          }}
        />
      )}

      {/* 백업 성공 모달 */}
      {isBackupSuccessOpen && (
        <ActiveModal
          active="success"
          title="백업 완료"
          content="구글 드라이브에 캡슐 내용이 저장되었습니다."
          open={isBackupSuccessOpen}
          onClose={() => setIsBackupSuccessOpen(false)}
          onConfirm={() => {
            setIsBackupSuccessOpen(false);
            if (closeHref) router.push(closeHref);
            else router.back();
            router.refresh();
          }}
        />
      )}

      {/* 신고 모달 */}
      {isReportOpen && (
        <ReportModal
          capsuleId={capsuleId}
          open={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      <div className="flex h-full justify-center md:p-15 p-6">
        <div className="flex flex-col max-w-300 w-full h-[calc(100vh-48px)] md:h-[calc(100vh-120px)] bg-bg rounded-2xl border border-outline">
          {/* Header */}
          <div className="shrink-0 border-b px-4 md:px-6 lg:px-8 py-3 md:py-4 border-outline">
            <div className="flex justify-between items-center gap-2 md:gap-4">
              <div className="flex-none font-medium text-base md:text-lg lg:text-xl">
                제목: {capsule.title}
              </div>

              <div className="flex-1 flex flex-col items-center gap-0.5 text-xs md:text-sm lg:text-base justify-center">
                <div className="flex flex-row gap-1">
                  <span className="hidden md:block text-text-2">
                    해제 조건:
                  </span>
                  <div className="flex items-center gap-1 text-text-3">
                    <div className="flex-none">
                      {isTime ? (
                        <Clock className="w-3 md:w-4 " />
                      ) : (
                        <MapPin className="w-3 md:w-4" />
                      )}
                    </div>
                    <span className="line-clamp-1">{unlockLabel}</span>
                  </div>
                </div>

                {unlockUntilLabel && (
                  <span className="text-xs md:text-xs text-text-3">
                    열람 가능 기한: {unlockUntilLabel} 까지
                  </span>
                )}
              </div>

              <div className="flex justify-end items-center gap-2">
                {isSender || isReceiver ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer text-primary"
                        aria-label="더보기"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 z-10000 bg-bg shadow-lg border border-outline"
                    >
                      <DropdownMenuLabel>관리</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {isReceiver && (
                          <DropdownMenuItem
                            className="hover:bg-button-hover"
                            onClick={() => backupMutation.mutate(capsuleId)}
                          >
                            <Download className="text-primary" />
                            {backupMutation.isPending
                              ? "백업 중..."
                              : "백업하기"}
                          </DropdownMenuItem>
                        )}
                        {isSender && !capsule.viewStatus && (
                          <DropdownMenuItem
                            className="hover:bg-button-hover"
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
                            className="hover:bg-button-hover"
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
                  className="cursor-pointer text-primary p-1 rounded-md hover:bg-button-hover"
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
              className="w-full h-full p-4 md:p-6 lg:p-12"
              style={{ backgroundColor: detailHex }}
            >
              <div className="w-full h-full flex flex-col justify-between gap-2 md:gap-4 lg:gap-8">
                <div className="text-base md:text-xl lg:text-2xl space-x-1">
                  <span className="text-primary font-bold">Dear.</span>
                  <span className="text-[#070d19]">{dearName}</span>
                </div>

                <div className="flex-1 mx-3 overflow-x-hidden overflow-y-auto space-y-4">
                  <pre className="text-[#070d19] whitespace-pre-wrap wrap-break-word text-lg">
                    {capsule.content}
                  </pre>

                  {/* 첨부 이미지 */}
                  {capsule.attachments && capsule.attachments.length > 0 && (
                    <div className="flex flex-col gap-3 mt-4 items-start">
                      {capsule.attachments.map((attachment) => (
                        <div
                          key={attachment.attachmentId}
                          className="relative w-full max-h-96"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={attachment.presignedUrl}
                            alt={`첨부 이미지 ${attachment.attachmentId}`}
                            className="max-h-96 w-auto h-auto object-contain rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1 lg:gap-2">
                  <span className="text-xs md:text-sm lg:text-base text-[#6f7786]">
                    {formatDate(capsule.createdAt)}
                  </span>
                  <div className="text-base md:text-xl lg:text-2xl space-x-1">
                    <span className="text-primary font-bold">From.</span>
                    <span className="text-[#070d19]">
                      {capsule.writerNickname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-outline p-5">
            {role === "ADMIN" ? null : (
              <div className="flex-1 flex items-center justify-center">
                {!isSender && (
                  <div className="flex-1 flex items-center justify-center">
                    <button
                      type="button"
                      className="cursor-pointer flex items-center justify-center gap-2"
                      onClick={() => setIsReportOpen(true)}
                    >
                      <MessageSquareWarning
                        size={16}
                        className="text-primary"
                      />
                      <span>신고하기</span>
                    </button>
                  </div>
                )}

                {/* <div className="flex-1 flex items-center justify-center">
                  <button
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LinkIcon size={16} className="text-primary" />
                    <span>링크 복사</span>
                  </button>
                </div> */}

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
                          isLiked ? "text-primary fill-error" : "text-primary"
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

                {/* 저장하기(공개) vs 북마크(보호) 분기 */}
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
