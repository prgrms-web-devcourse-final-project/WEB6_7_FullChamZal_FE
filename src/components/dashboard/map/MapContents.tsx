"use client";

import { Filter as FilterIcon, LocateFixed } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MapList from "./MapList";
import FilterArea from "./FilterArea";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCapsules } from "@/lib/api/dashboard/map";

//서버 렌더링 방지
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import LetterDetailView from "@/components/capsule/detail/LetterDetailView";
const PublicCapsuleMap = dynamic(() => import("./PublicCapsuleMap"), {
  ssr: false,
});

//필터링 타입
export type Radius = 1500 | 1000 | 500;
export type ViewedFilter = "ALL" | "UNREAD" | "READ";
export type AccessibleFilter = "ALL" | "ACCESSIBLE" | "INACCESSIBLE";

export default function MapContents() {
  /* 모바일 리스트 */
  const [isListOpen, setIsListOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [radius, setRadius] = useState<Radius>(1000);
  const [viewed, setViewed] = useState<ViewedFilter>("ALL");
  const [accessible, setAccessible] = useState<AccessibleFilter>("ALL");
  const filterRef = useRef<HTMLDivElement | null>(null);

  //map center 위치
  const [mapLocation, setMapLocation] = useState<{
    lat: number;
    lng: number;
  } | null>({ lat: 37.579763, lng: 126.977045 });
  //사용자 위치
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  //위치 정보 에러 메세지
  const [error, setError] = useState<string | null>(null);
  //포커스 된 card
  const [focus, setFocus] = useState<{ id: number; ts: number } | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  //위치 정보 가져오기 실패했을 때 상황에 따른 에러 메세지
  const showErrorMsg = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("Geolocation API의 사용 요청을 거부했습니다.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("위치 정보를 사용할 수 없습니다.");
        break;
      case error.TIMEOUT:
        setError(
          "위치 정보를 가져오기 위한 요청이 허용 시간을 초과했을습니다."
        );
        break;
      default:
        setError("알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.");
        break;
    }
  };

  //현재 사용자 위치로 map center 이동
  const MoveMyLocation = () => {
    if (!myLocation) return;
    setMapLocation({ ...myLocation });
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

    const onDown = (e: MouseEvent) => {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target as Node)) setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", onDown);

    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  //근처 공개 캡슐 조회
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["publicCapsules", myLocation?.lat, myLocation?.lng, radius],
    queryFn: () => {
      if (!myLocation) {
        throw new Error("현재 위치 정보 없음");
      }
      if (isError) {
        throw queryError;
      }

      return fetchPublicCapsules({
        lat: myLocation.lat,
        lng: myLocation.lng,
        radius,
      });
    },
    enabled: !!myLocation,
    staleTime: 1000 * 30,
  });

  //조회 상태 필터
  const filter = (data: PublicCapsule[] | undefined) => {
    if (data) {
      let result = data;
      switch (viewed) {
        case "ALL":
          break;
        case "UNREAD":
          result = result.filter((d: PublicCapsule) => d.isViewed === false);
          break;
        case "READ":
          result = result.filter((d: PublicCapsule) => d.isViewed === true);
          break;
      }
      switch (accessible) {
        case "ALL":
          return result;
        case "ACCESSIBLE":
          return result.filter((d: PublicCapsule) => d.isUnlockable === true);

        case "INACCESSIBLE":
          return result.filter((d: PublicCapsule) => d.isUnlockable === false);
      }
    } else return [];
  };

  const filteredData = filter(data);

  return id ? (
    <LetterDetailView
      isPublic={true}
      capsuleId={Number(id)}
      initialLocation={myLocation}
    />
  ) : (
    <div className="h-full flex flex-col gap-2 lg:gap-4">
      {/* 헤더 */}
      <div className="space-y-1 lg:space-y-2">
        <h3 className="text-xl lg:text-3xl font-medium">
          공개 편지 지도
          <span className="text-primary px-1">_</span>
        </h3>
        <p className="text-sm lg:text-base text-text-2">
          주변에 숨겨진{" "}
          <span className="text-primary font-semibold">
            {!myLocation || isLoading ? "-" : filteredData.length}개
          </span>
          의 편지를 찾아보세요
        </p>
      </div>

      {/* 지도 + 리스트 영역 */}
      <div className="flex-1 flex lg:flex-row flex-col gap-4 min-h-0">
        {/* 지도 */}
        <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden ">
          {/* 위치 정보 접근 불가능 시 안내*/}
          {error ? (
            <div className="w-full h-full absolute z-20 flex items-center justify-center select-none">
              <div className="inset-0 absolute bg-black opacity-50"></div>
              <div className="absolute text-sm z-3 text-white text-center">
                <p className="text-xl font-semibold">
                  위치 정보 접근이 <span className="text-primary-2">차단</span>
                  되어 있습니다
                </p>
                <p>
                  이 서비스는 내 주변 편지를 표시하기 위해 위치 정보 접근이
                  필요합니다.
                </p>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* 지도 컴포넌트 */}
          {mapLocation ? (
            <PublicCapsuleMap
              radius={radius}
              location={mapLocation}
              myLocation={myLocation}
              data={filteredData}
              focus={focus}
              onClick={(id, lat, lng) => {
                setFocus({ id, ts: Date.now() });
                setMapLocation({ lat, lng });
              }}
            />
          ) : (
            error
          )}

          {/* 사용자 위치 불러오기 버튼 */}
          <button
            type="button"
            className="cursor-pointer bg-white absolute bottom-4 right-4 p-3 rounded-xl z-10 shadow-lg text-primary"
            onClick={MoveMyLocation}
          >
            <LocateFixed size={24} />
          </button>

          {/* 모바일: 리스트 열기 버튼 */}
          <button
            type="button"
            className="cursor-pointer lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl z-10 shadow-lg text-sm bg-primary-2 text-white"
            onClick={() => setIsListOpen(true)}
          >
            주변 편지 보기 (
            {!myLocation || isLoading ? "-" : filteredData.length}
            개)
          </button>
        </div>

        {/* 리스트 (데스크탑만) */}
        <div className="w-90 rounded-xl bg-white/80 border border-outline hidden lg:flex flex-col gap-3 min-h-0 py-6">
          <div className="flex justify-between flex-none px-6 items-center">
            <span className="text-lg">주변 편지</span>

            {/* 필터 */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className="cursor-pointer p-2 rounded-lg hover:bg-sub transition"
                aria-haspopup="menu"
                aria-expanded={isFilterOpen}
              >
                <FilterIcon size={16} className="text-primary" />
              </button>

              {isFilterOpen && (
                <FilterArea
                  radius={radius}
                  onRadiusChange={setRadius}
                  viewed={viewed}
                  onViewedChange={setViewed}
                  accessible={accessible}
                  onAccessibleChange={setAccessible}
                  onClose={() => setIsFilterOpen(false)}
                  onReset={() => {
                    setRadius(1000);
                    setViewed("ALL");
                    setAccessible("ALL");
                  }}
                />
              )}
            </div>
          </div>

          {/* 리스트 영역 */}
          {myLocation ? (
            isLoading ? (
              <div className="text-center text-text-3 text-sm">로딩중</div>
            ) : (
              <MapList
                listData={filteredData}
                onClick={(id, lat, lng) => {
                  setMapLocation({ lat, lng });
                  setFocus({ id, ts: Date.now() });
                }}
                focus={focus}
              />
            )
          ) : (
            <div className="text-center text-text-3 text-sm">
              위치 정보 접근을 허용해주세요.
            </div>
          )}
        </div>

        {/* 모바일 리스트 */}
        <div className="lg:hidden">
          {/* overlay */}
          <div
            className={`fixed inset-0 z-9998 bg-black/40 transition-opacity ${
              isListOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsListOpen(false)}
          />

          {/* sheet */}
          <div
            className={`fixed left-0 right-0 bottom-0 z-9999 bg-white rounded-t-2xl border-t border-outline
              transition-transform duration-200 ease-out
              ${isListOpen ? "translate-y-0" : "translate-y-full"}`}
            aria-hidden={!isListOpen}
          >
            <div className="px-5 py-2 flex items-center justify-between border-b border-outline">
              <span>주변 편지</span>

              <div className="flex items-center gap-2">
                {/* 필터 버튼 */}
                <button
                  type="button"
                  onClick={() => {
                    setIsListOpen(true);
                    setIsFilterOpen((v) => !v);
                  }}
                  className="cursor-pointer p-2 rounded-lg hover:bg-sub transition"
                  aria-haspopup="menu"
                  aria-expanded={isFilterOpen}
                >
                  <FilterIcon size={16} className="text-primary" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsListOpen(false)}
                  className="cursor-pointer p-2 rounded-lg hover:bg-sub transition"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 필터 영역 (모바일에서는 시트 내부에 표시) */}
            <div className="relative px-5 pt-3" ref={filterRef}>
              {isFilterOpen && (
                <FilterArea
                  radius={radius}
                  onRadiusChange={setRadius}
                  viewed={viewed}
                  onViewedChange={setViewed}
                  accessible={accessible}
                  onAccessibleChange={setAccessible}
                  onClose={() => setIsFilterOpen(false)}
                  onReset={() => {
                    setRadius(1000);
                    setViewed("ALL");
                    setAccessible("ALL");
                  }}
                />
              )}
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              {myLocation ? (
                isLoading ? (
                  <div className="text-center text-text-3 text-sm">로딩중</div>
                ) : (
                  <MapList
                    listData={filteredData}
                    onClick={(id, lat, lng) => {
                      setMapLocation({ lat, lng });
                      setFocus({ id, ts: Date.now() });
                      setIsListOpen(false);
                    }}
                    focus={focus}
                  />
                )
              ) : (
                <div className="text-center text-text-3 text-sm">
                  위치 정보 접근을 허용해주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
