/* eslint-disable react-hooks/set-state-in-effect */
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
  // 내 위치 (current)
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(
    initialLocation
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  // initialLocation이 없을 때만 위치 정보 가져오기
  useEffect(() => {
    // initialLocation이 이미 있으면 스킵
    if (initialLocation) {
      setCurrentLocation(initialLocation);
      return;
    }

    let mounted = true;

    getCurrentPosition()
      .then((pos) => {
        if (!mounted) return;
        setCurrentLocation(pos);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setLocationError(
          e?.message || "위치 정보를 가져오지 못했어요. (권한/설정 확인)"
        );
        setCurrentLocation(null);
      });

    return () => {
      mounted = false;
    };
  }, [initialLocation]);

  // 너무 자주 리패치 방지(좌표 라운딩)
  const locationKey = useMemo(() => {
    if (!currentLocation) return "no-location";
    const lat = Number(currentLocation.lat.toFixed(5));
    const lng = Number(currentLocation.lng.toFixed(5));
    return `${lat},${lng}`;
  }, [currentLocation]);

  //스토리트랙 캡슐, 일반 캡슐 queryKey 구분
  const queryKey = isStoryTrack
    ? ["storyTrackCapsuleRead", storytrackId, capsuleId, password, locationKey]
    : ["capsuleRead", capsuleId, password, locationKey];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async ({ signal }) => {
      const unlockAt = new Date().toISOString();

      const locationLat = currentLocation?.lat ?? 0;
      const locationLng = currentLocation?.lng ?? 0;

      if (isStoryTrack && storytrackId) {
        const res = await storyTrackCapsuleApi.read(
          {
            storytrackId,
          },
          {
            capsuleId,
            unlockAt,
            locationLat,
            locationLng,
            password,
          },
          signal
        );
        return res;
      } else {
        const res = await guestCapsuleApi.read(
          {
            capsuleId,
            unlockAt,
            locationLat,
            locationLng,
            password,
          },
          signal
        );
        return res;
      }
    },
    retry: false,
    // 공개 캡슐의 경우 위치 정보가 준비될 때까지 대기
    // initialLocation이 있으면 즉시 실행, 없으면 currentLocation이 설정될 때까지 대기
    enabled:
      capsuleId > 0 && (initialLocation !== null || currentLocation !== null),
  });

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
    // 히스토리 없는 진입(공유 링크 첫 방문) 대비
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/dashboard", { scroll: false });
  };

  const shouldShowLocationPermissionGate =
    isPublic &&
    initialLocation === null &&
    currentLocation === null &&
    !!locationError;

  if (shouldShowLocationPermissionGate) {
    return (
      <div className="h-full w-full flex items-center justify-center p-0 md:p-8">
        <div className="w-full max-w-md rounded-2xl border border-outline bg-bg p-4 md:p-6 space-y-5">
          {/* 헤더 */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-text">
              위치 권한이 필요해요
            </h2>
            <p className="text-sm text-text-2 leading-relaxed">
              이 편지는 <span className="font-medium text-text">장소 조건</span>
              이 있어 현재 위치 확인이 필요해요.
              <br />
              Chrome에서 위치 권한을{" "}
              <span className="font-medium text-text">허용</span>으로 변경해
              주세요.
            </p>
          </div>

          {/* 방법 안내 */}
          <details className="rounded-xl border border-outline bg-sub/60 px-3 md:px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-text">
              Chrome에서 위치 권한 설정 방법
            </summary>

            <div className="mt-4 space-y-4 text-sm text-text-2">
              <div>
                <div className="font-medium text-text mb-1">
                  모바일 (Chrome)
                </div>
                <ol className="list-decimal pl-4 md:pl-5 space-y-1">
                  <li>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        주소창 왼쪽의 자물쇠
                        <CircleAlert size={20} className="flex-none" />
                      </div>
                      <span>또는 사이트 정보 아이콘을 누르세요.</span>
                    </div>
                  </li>
                  <li>사이트 설정(또는 권한) → 위치로 이동하세요.</li>
                  <li>위치를 “허용”으로 변경한 뒤 다시 시도해 주세요.</li>
                </ol>
              </div>

              <div>
                <div className="font-medium text-text mb-1">PC (Chrome)</div>
                <ol className="list-decimal pl-4 md:pl-5 space-y-1">
                  <li>
                    <div className="flex gap-1">
                      주소창 왼쪽의 자물쇠
                      <CircleAlert size={20} />를 클릭하세요.
                    </div>
                  </li>
                  <li>사이트 설정 → 위치 → 허용으로 변경하세요.</li>
                  <li>페이지를 새로고침한 뒤 다시 시도해 주세요.</li>
                </ol>
              </div>

              <p className="text-xs text-text-3 leading-relaxed">
                위치가 “차단됨”으로 되어 있으면 확인할 수 없어요.
                <br />
                기기 자체 위치 서비스(GPS)가 켜져 있는지도 함께 확인해 주세요.
              </p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        불러오는 중...
      </div>
    );
  }

  // 여기서부터 에러 코드/메시지 기반 UI 분기
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

  // 응답 없음
  if (!data) {
    return (
      <ApiError
        title="데이터를 불러오지 못했어요"
        description={"잠시 후 다시 시도해주세요."}
        onRetry={() => refetch()}
      />
    );
  }

  const capsule = data;

  // 조건 미충족 (서버가 FAIL을 정상 응답으로 내려줌)
  if (capsule.result === "FAIL") {
    const maybeTarget = { lat: capsule.locationLat, lng: capsule.locationLng };
    const targetLocation = isLatLng(maybeTarget) ? maybeTarget : undefined;

    return (
      <div className="h-screen w-full flex items-center justify-center p-8">
        <LetterLockedView
          isPublic={isPublic}
          unlockAt={capsule.unlockAt ?? new Date().toISOString()}
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
