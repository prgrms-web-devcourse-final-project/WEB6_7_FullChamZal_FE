"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/common/tag/BackButton";
import TrackHeader from "./TrackHeader";
import TrackOverview from "./TrackOverview";
import TrackProgress from "./TrackProgress";
import TrackTabMenu from "./TrackTabMenu";
import TrackRoute from "./TrackRoute";
import TrackMap from "./TrackMap";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import LetterDetailView from "@/components/capsule/detail/LetterDetailView";
import ActiveModal from "@/components/common/modal/ActiveModal";
import TrackDetailSkeleton from "@/components/skeleton/dashboard/storytrack/TrackDetailSkeleton";
import ApiError from "@/components/common/error/ApiError";

type TabType = "route" | "map";

export default function TrackDetailPage() {
  const [isLocationFailOpen, setIsLocationFailOpen] = useState(false);
  const [tab, setTab] = useState<TabType>("map");

  // 스토리트랙 id
  const params = useParams();
  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;

  // 캡슐 페이지네이션
  const page = 0;
  const size = 100;

  // 캡슐 상세 조회 시 캡슐 id
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get("id");

  // 사용자 위치
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 위치 정보 에러 메세지
  const [locationError, setLocationError] = useState<string | null>(null);

  const showErrorMsg = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationError("Geolocation API의 사용 요청을 거부했습니다.");
        break;
      case error.POSITION_UNAVAILABLE:
        setLocationError("위치 정보를 사용할 수 없습니다.");
        break;
      case error.TIMEOUT:
        setLocationError(
          "위치 정보를 가져오기 위한 요청이 허용 시간을 초과했을습니다."
        );
        break;
      default:
        setLocationError(
          "알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요."
        );
        break;
    }
    setIsLocationFailOpen(true);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        showErrorMsg(err);
      }
    );
  }, []);

  // 스토리트랙 상세 조회
  const query = useQuery({
    queryKey: ["storyTrackDetail", storytrackId, page, size],
    queryFn: ({ signal }) =>
      storyTrackApi.storyTrackDetail({ storytrackId, page, size }, signal),
    enabled: !!storytrackId,
    staleTime: 30_000,
    retry: 1,
  });

  const { data, isLoading, isError, error, refetch } = query;

  // 로딩 처리
  if (!storytrackId || isLoading) {
    return <TrackDetailSkeleton />;
  }

  // 에러 처리
  if (isError) {
    return (
      <ApiError
        title="공개 편지를 불러오지 못했어요."
        description={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  const memberType = data?.data.memberType;
  const paths = data?.data.paths?.content ?? [];

  return (
    // 모바일: 전체 스크롤
    // 데스크탑: 내부 패널 스크롤
    <div className="min-h-dvh lg:h-screen flex flex-col p-4 lg:p-8 gap-4 lg:gap-8">
      {/* 캡슐 상세 */}
      {capsuleId ? (
        myLocation ? (
          <LetterDetailView
            isPublic={true}
            isStoryTrack={true}
            storytrackId={storytrackId}
            capsuleId={Number(capsuleId)}
            initialLocation={myLocation}
          />
        ) : (
          <ActiveModal
            active="fail"
            title="위치 정보 접근 차단"
            content={locationError ?? "위치 정보를 사용할 수 없습니다."}
            open={isLocationFailOpen}
            onClose={() => setIsLocationFailOpen(false)}
            onConfirm={() => {
              setIsLocationFailOpen(false);
              window.location.reload();
            }}
          />
        )
      ) : (
        <>
          <div className="flex-none">
            <BackButton />
          </div>

          {/* 모바일: 세로 스택 / 데스크탑: 가로 2컬럼 */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
            {/* Left */}
            <div className="lg:flex-1 lg:min-w-80 flex flex-col gap-4 lg:gap-6 min-h-0">
              <div className="border border-outline rounded-2xl overflow-hidden">
                <TrackHeader />
              </div>

              <div className="border border-outline rounded-2xl lg:flex-1 lg:min-h-0 overflow-hidden">
                <TrackOverview />
              </div>
            </div>

            {/* Right */}
            <div className="lg:flex-3 flex flex-col gap-4 lg:gap-6 min-h-0">
              {/* Top */}
              {(memberType === "PARTICIPANT" || memberType === "COMPLETED") && (
                <div className="border border-outline rounded-2xl overflow-hidden">
                  <TrackProgress />
                </div>
              )}

              {/* Bottom */}
              <div className="border border-outline rounded-2xl overflow-hidden flex flex-col lg:flex-1 lg:min-h-0">
                <TrackTabMenu activeTab={tab} onChange={setTab} />

                <div className="overflow-visible lg:overflow-auto lg:flex-1 lg:min-h-0">
                  {tab === "map" && (
                    <TrackMap
                      storytrackType={data?.data.storytrackType}
                      capsuleList={paths}
                    />
                  )}
                  {tab === "route" && (
                    <TrackRoute
                      myLocation={myLocation}
                      memberType={memberType}
                      storytrackType={data?.data.storytrackType}
                      capsuleList={paths}
                      completedCapsuleList={data?.data.completedCapsuleId}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
