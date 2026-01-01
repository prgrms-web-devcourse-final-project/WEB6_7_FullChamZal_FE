"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/common/BackButton";
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
import ActiveModal from "@/components/common/ActiveModal";

type TabType = "route" | "map";

export default function TrackDetailPage() {
  const [isLocationFailOpen, setIsLocationFailOpen] = useState(false);
  const [tab, setTab] = useState<TabType>("map");
  //스토리트랙 id
  const params = useParams();
  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;

  //캡슐 페이지네이션
  const [page] = useState(0);
  const [size] = useState(100);

  //캡슐 상세 조회 시 캡슐 id
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get("id");

  // 스토리트랙 상세 조회
  const { data, isError, error } = useQuery({
    queryKey: ["storyTrackDetail", storytrackId],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.storyTrackDetail(
        { storytrackId, page, size },
        signal
      );
    },
    enabled: !!storytrackId,
  });

  //사용자 위치
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  //위치 정보 에러 메세지
  const [locationError, setLocationError] = useState<string | null>(null);

  //위치 정보 가져오기 실패했을 때 상황에 따른 에러 메세지
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation({
            lat: position.coords.latitude, //위도값 저장
            lng: position.coords.longitude, //경도값 저장
          });
        },
        (err) => {
          showErrorMsg(err);
        }
      );
    }
  }, []);

  if (isError) {
    console.error(error);
    return <div>{String(error)}</div>;
  }
  return (
    // 모바일: 전체 스크롤
    // 데스크탑: 내부 패널 스크롤
    <div className="min-h-dvh lg:h-screen flex flex-col p-4 lg:p-8 gap-4 lg:gap-8">
      {capsuleId &&
        (myLocation ? (
          <LetterDetailView
            isPublic={true}
            capsuleId={Number(capsuleId)}
            initialLocation={myLocation}
          />
        ) : (
          <ActiveModal
            active="fail"
            title="위치 정보 접근 차단"
            content={`${locationError}`}
            open={isLocationFailOpen}
            onClose={() => setIsLocationFailOpen(false)}
            onConfirm={() => {
              setIsLocationFailOpen(false);
              window.location.reload();
            }}
          />
        ))}
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
          {/* role이 참여자일 경우에만 보이도록 처리할 예정 */}
          {(data?.data.memberType === "PARTICIPANT" ||
            data?.data.memberType === "COMPLETED") && (
            <div className="border border-outline rounded-2xl overflow-hidden">
              <TrackProgress />
            </div>
          )}

          {/* Bottom */}
          <div className="border border-outline rounded-2xl overflow-hidden flex flex-col lg:flex-1 lg:min-h-0">
            <TrackTabMenu activeTab={tab} onChange={setTab} />

            <div className="p-4 lg:p-6 overflow-visible lg:overflow-auto lg:flex-1 lg:min-h-0">
              {tab === "map" && (
                <TrackMap
                  storytrackType={data?.data.storytrackType}
                  capsuleList={data?.data.paths.content}
                />
              )}
              {tab === "route" && (
                <TrackRoute
                  memberType={data?.data.memberType}
                  storytrackType={data?.data.storytrackType}
                  capsuleList={data?.data.paths.content}
                  completedCapsuleList={data?.data.completedCapsuleId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
