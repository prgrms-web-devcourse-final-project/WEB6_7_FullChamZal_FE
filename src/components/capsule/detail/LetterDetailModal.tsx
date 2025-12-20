/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ActiveModal from "@/components/common/ActiveModal";
/* eslint-disable react-hooks/rules-of-hooks */

import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import { formatDate } from "@/lib/hooks/formatDate";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  LinkIcon,
  MapPin,
  Reply,
  X,
  Archive,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type UICapsule = {
  title: string;
  content: string;
  createdAt: string;
  writerNickname: string;
  recipient: string | null;

  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION" | string;
  unlockAt: string | null;
  unlockUntil?: string | null;

  locationName: string | null; // (USER: locationName / ADMIN: alias/address)
};

type PostLoginAction = {
  type: "SAVE_CAPSULE";
  payload: { capsuleId: number; isSendSelf: 0 | 1 };
};

const POST_LOGIN_ACTION_KEY = "postLoginAction";

function isAuthMissingError(err: any) {
  // apiFetch 구현에 따라 다름: status / response.status / code 등으로 판별
  const status = err?.status ?? err?.response?.status;
  return status === 401 || status === 403;
}

export default function LetterDetailModal({
  capsuleId,
  open = true,
  closeHref,
  isProtected,
  role = "USER",
  onClose,

  // USER read 호출에 필요한 값들
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
  const isAdmin = role === "ADMIN";
  const router = useRouter();
  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);

  if (!open) return null;

  const close = () => {
    if (closeHref) router.push(closeHref, { scroll: false });
    else router.back();
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // ✅ 현재 페이지 returnUrl 만들기 (쿼리까지 포함)
  const returnUrl = useMemo(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : `${pathname}`;
  }, [pathname, searchParams]);

  const saveMutation = useMutation({
    mutationKey: ["capsuleSave", capsuleId],
    mutationFn: (payload: {
      capsuleId: number;
      isSendSelf: 0 | 1;
      unlockAt: string;
    }) => guestCapsuleApi.save(payload),
    onSuccess: () => {
      setIsSaveSuccessOpen(true);
    },
  });
  /**
   * ✅ 로그인/회원가입 후 돌아왔을 때 자동 재시도
   * - 컴포넌트 마운트 시 sessionStorage 확인
   */
  useEffect(() => {
    if (!open) return;

    const raw = sessionStorage.getItem(POST_LOGIN_ACTION_KEY);
    if (!raw) return;

    let action: PostLoginAction | null = null;
    try {
      action = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(POST_LOGIN_ACTION_KEY);
      return;
    }

    if (!action) return;

    // SAVE_CAPSULE 재시도
    if (action.type === "SAVE_CAPSULE") {
      // 여기서 “이미 로그인 성공했는지”까지 한 번 더 확인하고 싶으면 me를 한 번 더 호출해도 됨
      const unlockAt = new Date().toISOString();
      saveMutation.mutate({
        capsuleId: action.payload.capsuleId,
        isSendSelf: action.payload.isSendSelf,
        unlockAt,
      });

      // 재시도는 1회만 (무한루프 방지)
      sessionStorage.removeItem(POST_LOGIN_ACTION_KEY);
    }
  }, [open, saveMutation]);

  /**
   * 저장 버튼 핸들러
   * - me 조회 -> 있으면 저장
   * - 없으면 login/signup으로 보내고 돌아오면 재시도
   */
  const handleSave = async () => {
    try {
      // 1) me 조회로 로그인 여부 확인
      const me = await authApiClient.me(); // TODO: signal 필요하면 authApi.me(signal) 형태로
      // me가 null일 수 있는 구현이면 여기서 분기
      if (!me) {
        throw Object.assign(new Error("NO_ME"), { status: 401 });
      }

      // 2) 로그인 상태면 저장 실행
      const unlockAt = new Date().toISOString();
      saveMutation.mutate({ capsuleId, isSendSelf: 0, unlockAt });
    } catch (err: any) {
      // 3) 인증 없으면: 돌아와서 재시도할 액션 저장
      if (isAuthMissingError(err)) {
        const action: PostLoginAction = {
          type: "SAVE_CAPSULE",
          payload: { capsuleId, isSendSelf: 0 },
        };
        sessionStorage.setItem(POST_LOGIN_ACTION_KEY, JSON.stringify(action));

        // 4) 로그인 or 회원가입으로 이동
        //    - 여기서 "아이디가 없으면 회원가입" 플로우는 로그인 화면에서 처리하는 게 일반적임.
        //    - 예: 로그인 페이지에 "회원가입" 버튼, 또는 로그인 실패 시 "회원가입" 유도.
        router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        return;
      }

      // 인증 문제 아니면 진짜 에러
      console.error("❌ save error:", err);
      // TODO: 토스트/에러 UI
    }
  };

  // 나중에 ADMIN일 경우에는 아래 api만 USER이면 USER 세부 api만 호출
  const { data, isLoading, isError, error } = useQuery<UICapsule>({
    queryKey: ["capsuleDetailModal", role, capsuleId, password],
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

      // USER: read API (조건 검증 포함)
      const unlockAt = new Date().toISOString();

      const pos =
        locationLat != null && locationLng != null
          ? { lat: locationLat, lng: locationLng }
          : await new Promise<{ lat: number; lng: number }>(
              (resolve, reject) => {
                if (!navigator.geolocation)
                  reject(new Error("위치 정보를 사용할 수 없습니다."));
                navigator.geolocation.getCurrentPosition(
                  (p) =>
                    resolve({
                      lat: p.coords.latitude,
                      lng: p.coords.longitude,
                    }),
                  reject,
                  { enableHighAccuracy: true, timeout: 10_000 }
                );
              }
            );

      const r = await guestCapsuleApi.read(
        {
          capsuleId,
          unlockAt,
          locationLat: pos.lat ?? 0,
          locationLng: pos.lng ?? 0,
          password,
        },
        signal
      );

      const u = r;

      console.log(u);

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
    enabled: open && capsuleId > 0,
    retry: false,
  });

  // 로딩 UI
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
              <button
                type="button"
                onClick={role === "ADMIN" ? onClose : close}
                className="cursor-pointer text-primary"
              >
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
      {/* 모달 placeholder */}
      {isSaveSuccessOpen && (
        <ActiveModal
          active={"success"}
          title={"저장 완료"}
          content={"저장이 완료되었습니다."}
          open={isSaveSuccessOpen}
          onClose={() => setIsSaveSuccessOpen(false)}
          onConfirm={() => redirect("/dashboard")}
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

              <button
                type="button"
                className="md:flex-1 flex justify-end cursor-pointer text-primary"
                onClick={role === "ADMIN" ? onClose : close}
              >
                <X size={24} />
              </button>
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
                    onClick={handleSave}
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                  >
                    {!isProtected ? (
                      <>
                        <Archive size={16} className="text-primary" />
                        <span>저장하기</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} className="text-primary" />
                        <span>북마크</span>
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
