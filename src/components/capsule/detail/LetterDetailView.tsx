/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LetterDetailModal, { type UICapsule } from "./LetterDetailModal";
import LetterLockedView from "./LetterLockedView";
import {
  guestCapsuleApi,
  storyTrackCapsuleApi,
} from "@/lib/api/capsule/guestCapsule";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import ApiError from "@/components/common/error/ApiError";

type LatLng = { lat: number; lng: number };

function isLatLng(v: any): v is LatLng {
  return (
    v != null &&
    typeof v.lat === "number" &&
    Number.isFinite(v.lat) &&
    typeof v.lng === "number" &&
    Number.isFinite(v.lng)
  );
}

function getCurrentPosition(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) =>
        resolve({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  });
}

/* 어떤 에러가 와도 code/message/status로 정규화 */
function normalizeApiError(err: any): {
  code?: string;
  message: string;
  status?: number;
} {
  if (!err) return { message: "알 수 없는 오류가 발생했습니다." };

  // fetch/axios 류
  const data =
    err?.response?.data ??
    err?.data ??
    err?.cause?.response?.data ??
    err?.cause?.data ??
    null;

  const code = data?.code ?? err?.code ?? err?.errorCode;
  const status = err?.response?.status ?? err?.status ?? data?.status;

  const message =
    data?.message ??
    err?.message ??
    (err instanceof Error ? err.message : undefined) ??
    "요청 처리 중 오류가 발생했습니다.";

  return { code, status, message: String(message) };
}

type Props = {
  isPublic?: boolean;
  isStoryTrack?: boolean;
  storytrackId?: string;
  capsuleId: number;
  isProtected?: number;
  password?: string | null;
  initialLocation?: LatLng | null;
};

export default function LetterDetailView({
  isPublic = false,
  isStoryTrack = false,
  storytrackId,
  capsuleId,
  isProtected,
  password = null,
  initialLocation = null,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ---------------- LOCATION STATE ----------------
  // 내 위치 (current)
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(
    initialLocation
  );
  // 위치 상태
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >(initialLocation ? "ready" : "idle");

  useEffect(() => {
    if (initialLocation) return;

    setLocationStatus("loading");
    getCurrentPosition()
      .then((pos) => {
        setCurrentLocation(pos);
        setLocationError(null);
        setLocationStatus("ready");
      })
      .catch((e) => {
        setLocationError(
          e?.message || "위치 정보를 가져오지 못했어요. (권한/설정 확인)"
        );
        setCurrentLocation(null);
        setLocationStatus("error");
      });
  }, [initialLocation]);

  // ---------------- QUERY ----------------
  // 너무 자주 리패치 방지(좌표 라운딩)
  const locationKey = useMemo(() => {
    if (!currentLocation) return "no-location";
    return `${currentLocation.lat.toFixed(5)},${currentLocation.lng.toFixed(
      5
    )}`;
  }, [currentLocation]);

  const queryKey = isStoryTrack
    ? ["storyTrackCapsuleRead", storytrackId, capsuleId, password, locationKey]
    : ["capsuleRead", capsuleId, password, locationKey];

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey,
    enabled: capsuleId > 0,
    retry: false,
    queryFn: async ({ signal }) => {
      const unlockAt = new Date().toISOString();

      const locationLat = currentLocation?.lat ?? 0;
      const locationLng = currentLocation?.lng ?? 0;

      if (isStoryTrack && storytrackId) {
        return storyTrackCapsuleApi.read(
          { storytrackId },
          {
            capsuleId,
            unlockAt,
            locationLat,
            locationLng,
            password,
          },
          signal
        );
      }

      return guestCapsuleApi.read(
        {
          capsuleId,
          unlockAt,
          locationLat,
          locationLng,
          password,
        },
        signal
      );
    },
  });

  // ---------------- SIDE EFFECT ----------------
  //캡슐 읽기 성공하면 storyTrackDetail 재요청
  useEffect(() => {
    if (isStoryTrack && storytrackId && data?.result === "SUCCESS") {
      queryClient.invalidateQueries({
        queryKey: ["storyTrackDetail", storytrackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["storyTrackProgress", storytrackId],
      });
    }
  }, [isStoryTrack, storytrackId, data, queryClient]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard", { scroll: false });
    }
  };

  const shouldShowLocationPermissionGate =
    isPublic &&
    locationStatus === "error" &&
    !initialLocation &&
    !currentLocation;

  // ---------------- UI FLOW ----------------

  // 1. 위치 권한 실패
  if (shouldShowLocationPermissionGate) {
    return (
      <div className="h-full w-full flex items-center justify-center p-0 md:p-8">
        <div className="w-full max-w-md rounded-2xl border border-outline bg-bg p-4 md:p-6 space-y-5">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-text">
              위치 권한이 필요해요
            </h2>
            <p className="text-sm text-text-2 leading-relaxed">
              이 편지는 <span className="font-medium text-text">장소 조건</span>
              이 있어 현재 위치 확인이 필요해요.
            </p>
          </div>

          <details className="rounded-xl border border-outline bg-sub/60 px-3 md:px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-text">
              Chrome에서 위치 권한 설정 방법
            </summary>
            <div className="mt-4 text-sm text-text-2 space-y-2">
              <p>
                주소창 왼쪽의 자물쇠 <CircleAlert size={14} /> → 사이트 설정 →
                위치 → 허용
              </p>
              <p>변경 후 새로고침해주세요.</p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  // 2. 쿼리 로딩
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        불러오는 중...
      </div>
    );
  }

  // 3. 위치 확인 중 (GPS 요청 중일 때만)
  if (
    isPublic &&
    locationStatus === "loading" &&
    !initialLocation &&
    !currentLocation
  ) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8 text-text-3">
        위치 정보를 확인하고 있어요…
      </div>
    );
  }

  // 4. 에러 처리
  if (isError) {
    const e = normalizeApiError(error);
    // 인증 필요(로그인 필요)
    if (e.message === "인증이 필요합니다." || e.code === "AUTH001") {
      return (
        <div className="w-full min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md rounded-2xl border border-outline bg-bg p-6 text-center space-y-4">
            <div className="text-lg font-medium">권한이 없습니다.</div>
            <p className="text-sm text-text-2 whitespace-pre-line">
              이 편지는 인증된 사용자에게만 공개됩니다.
              {"\n"}
              로그인하거나 권한을 확인한 뒤 다시 시도해 주세요.
            </p>

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="cursor-pointer px-4 py-2 rounded-lg border border-outline text-text hover:bg-button-hover"
              >
                뒤로 가기
              </button>
              <button
                type="button"
                onClick={() => refetch()}
                className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 정지 회원
    if (e.code === "AUTH010") {
      return (
        <ApiError
          title="정지된 회원입니다."
          description={
            "정지된 회원은 이용할 수 없습니다.\n관리자에게 문의해주세요."
          }
          onRetry={handleBack}
        />
      );
    }

    // IP 차단
    if (e.code === "SEC001") {
      return (
        <ApiError
          title="접근이 차단되었습니다."
          description={
            "접근이 차단된 IP 주소입니다.\n네트워크 환경(회사/학교/공용 Wi-Fi/VPN)을 변경한 뒤 다시 시도해주세요."
          }
          onRetry={handleBack}
        />
      );
    }

    // Rate limit
    if (e.code === "SEC002" || e.code === "SEC003" || e.status === 429) {
      return (
        <ApiError
          title="요청이 너무 많아요."
          description={
            e.code === "SEC002"
              ? "요청 횟수 제한을 초과했습니다.\n잠시 후 다시 시도해주세요."
              : "잠시 후 다시 시도해주세요."
          }
          onRetry={() => refetch()}
        />
      );
    }

    // 선착순 마감
    if (e.code === "FCM001") {
      return (
        <ApiError
          title="선착순이 마감되었습니다."
          description={
            "이 편지는 선착순으로 열람 가능했어요.\n이미 마감되어 더 이상 확인할 수 없습니다."
          }
          onRetry={handleBack}
        />
      );
    }

    // 비정상 접근 패턴 / 의심 접근
    if (e.code === "SEC004" || e.code === "SEC006") {
      return (
        <ApiError
          title="접근이 제한되었습니다."
          description={
            "비정상적이거나 의심스러운 접근이 감지되었습니다.\n잠시 후 다시 시도해주세요."
          }
          onRetry={handleBack}
        />
      );
    }

    // GPS 스푸핑 의심
    if (e.code === "SEC005") {
      return (
        <ApiError
          title="위치 확인에 실패했어요."
          description={
            "위치 정보 조작이 의심됩니다.\n가짜 GPS/개발자 옵션/위치 관련 앱을 끄고 다시 시도해주세요."
          }
          onRetry={() => refetch()}
        />
      );
    }

    // 그 외는 공통 에러
    return (
      <ApiError
        title="서버 오류가 발생했어요"
        description={
          "잠시 후 다시 시도해주세요.\n문제가 계속되면 네트워크 상태를 확인해주세요."
        }
        onRetry={() => refetch()}
      />
    );
  }

  // 5. 진짜 데이터 없음
  if (!data && !isFetching) {
    return (
      <ApiError
        title="데이터를 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
        onRetry={() => refetch()}
      />
    );
  }

  const capsule = data!;

  // 조건 미충족 (서버가 FAIL을 정상 응답으로 내려줌)
  if (capsule.result === "FAIL") {
    const maybeTarget = { lat: capsule.locationLat, lng: capsule.locationLng };
    const targetLocation = isLatLng(maybeTarget) ? maybeTarget : undefined;

    // unlockUntil 만료 체크 (시간 초과)
    if (
      capsule.unlockUntil &&
      new Date(capsule.unlockUntil).getTime() < Date.now()
    ) {
      return (
        <ApiError
          title="열람 시간이 지났어요"
          description={
            "이 편지는 정해진 시간까지만 열 수 있어요.\n이미 열람 가능 시간이 종료되었습니다."
          }
          onRetry={handleBack}
        />
      );
    }

    return (
      <div className="h-screen w-full flex items-center justify-center p-8">
        <LetterLockedView
          isPublic={isPublic}
          unlockAt={capsule.unlockAt ?? new Date().toISOString()}
          unlockUntil={capsule.unlockUntil ?? new Date().toISOString()}
          unlockType={capsule.unlockType}
          currentLocation={currentLocation ?? undefined}
          targetLocation={targetLocation}
          locationName={capsule.locationName}
          locationErrorMessage={locationError ?? undefined}
        />
      </div>
    );
  }

  // 열람 가능
  // LetterDetailView에서 이미 데이터를 가져왔으므로, LetterDetailModal에 전달하여 중복 요청 방지
  const modalData: UICapsule = {
    capsuleColor: capsule.capsuleColor ?? null,
    title: capsule.title,
    content: capsule.content,
    createdAt: capsule.createdAt,
    writerNickname: capsule.senderNickname,
    recipient: capsule.recipient ?? null,
    unlockType: capsule.unlockType,
    unlockAt: capsule.unlockAt,
    unlockUntil: capsule.unlockUntil,
    locationName: capsule.locationName ?? null,
    viewStatus: !!capsule.viewStatus,
    isBookmarked: !!capsule.isBookmarked,
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-8">
      <LetterDetailModal
        capsuleId={capsule.capsuleId}
        isProtected={isProtected}
        role="USER"
        open={true}
        password={password}
        initialData={modalData}
      />
    </div>
  );
}
