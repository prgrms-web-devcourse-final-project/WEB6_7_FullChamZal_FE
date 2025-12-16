"use client";

import { Filter as FilterIcon, LocateFixed, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MapList from "./MapList";
import FilterArea from "./FilterArea";

//서버 렌더링 방지
import dynamic from "next/dynamic";
const KakaoMap = dynamic(() => import("./KakaoMap"), {
  ssr: false,
});

//필터링 타입
export type Radius = 1500 | 1000 | 500;
export type ViewedFilter = "ALL" | "UNREAD" | "READ";

export default function MapContents() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [radius, setRadius] = useState<Radius>(1500);
  const [viewed, setViewed] = useState<ViewedFilter>("ALL");

  const filterRef = useRef<HTMLDivElement | null>(null);

  //map 이동 위치
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    { lat: 37.579763, lng: 126.977045 }
  );
  //사용자 위치
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

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

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      //현 브라우저가 Geolocation API를 지원하는지 확인
      navigator.geolocation.getCurrentPosition(
        //사용자의 현재 위치를 요청
        (position) => {
          setLocation({
            lat: position.coords.latitude, //위도값 저장
            lng: position.coords.longitude, //경도값 저장
          });
        },
        (err) => {
          showErrorMsg(err); //상황에 따른 에러메세지 호출
        },
        {
          //옵션 객체
          enableHighAccuracy: true, // 정확도 우선모드
          timeout: 60000, // 1분 이내에 응답 없으면 에러 발생
          maximumAge: Infinity, //항상 캐시 값 저장된 위치 정보 반환
        }
      );
    } else {
      setError("브라우저가 Geolocation을 지원하지 않습니다.");
    }
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

  return (
    <div className="h-full flex flex-col gap-4">
      {/* 헤더 */}
      <div className="space-y-2">
        <h3 className="text-3xl font-medium">
          공개 편지 지도
          <span className="text-primary px-1">_</span>
        </h3>
        <p className="text-text-2">
          주변에 숨겨진 <span className="text-primary font-semibold">6개</span>
          의 편지를 찾아보세요
        </p>
      </div>

      {/* 검색 */}
      <div className="relative w-full">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4"
        />
        <input
          type="text"
          placeholder="장소, 제목으로 검색..."
          className="w-full p-4 pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
        />
      </div>

      {/* 지도 + 리스트 영역 */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* 지도 */}
        <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden ">
          {/* 위치 정보 접근 불가능 시 안내*/}
          {myLocation ? (
            ""
          ) : (
            <div className="w-full h-full absolute z-20 flex items-center justify-center">
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
          )}

          {/* 지도 컴포넌트 */}
          {location ? <KakaoMap location={location} /> : error}

          {/* 사용자 위치 불러오기 버튼 */}
          <button
            type="button"
            className="bg-white absolute bottom-4 right-4 p-3 rounded-xl z-10 shadow-lg text-primary"
            onClick={getUserLocation}
          >
            <LocateFixed size={24} />
          </button>
        </div>

        {/* 리스트 */}
        <div className="w-[360px] rounded-xl bg-white/80 border border-outline flex flex-col gap-8 min-h-0 py-6">
          <div className="flex justify-between flex-none px-6 items-center">
            <span className="text-lg">주변 편지</span>

            {/* 필터 */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className="p-2 rounded-lg hover:bg-sub transition"
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
                  onClose={() => setIsFilterOpen(false)}
                  onReset={() => {
                    setRadius(500);
                    setViewed("ALL");
                  }}
                />
              )}
            </div>
          </div>

          {/* 리스트 영역 */}
          {myLocation ? (
            <MapList />
          ) : (
            <div className="text-center text-text-3 text-sm">
              위치 정보 접근을 허용해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
