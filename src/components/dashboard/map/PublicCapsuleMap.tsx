"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, MarkerClusterer } from "react-kakao-maps-sdk";

const onClusterclick = () => {};

//마커 생성
const EventMarkerContainer = ({
  position,
  content,
  onClick,
  isFocus,
  showCapsule,
}: {
  position: { lat: number; lng: number };
  content: string;
  onClick: () => void;
  isFocus: boolean;
  showCapsule: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <CustomOverlayMap position={position} zIndex={isFocus ? 999 : 1}>
      <div
        className={`relative flex flex-col items-center`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={onClick}
      >
        {/* title */}
        <div
          className={`
            absolute bottom-full mb-2
            p-3 text-sm rounded-lg shadow
            bg-white 
            ${
              isVisible
                ? "opacity-100 cursor-pointer"
                : "opacity-0 pointer-none"
            }
          `}
          onClick={showCapsule}
        >
          {content}
        </div>
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-full ${
            isFocus ? "bg-primary scale-[1.2]" : "bg-primary-2"
          }`}
          onClick={onClick}
        >
          <MapPin color="white"></MapPin>
        </div>
      </div>
    </CustomOverlayMap>
  );
};

//줌따라 스케일 조정 함수
const scaleClassByZoom = (level: number) => {
  if (level <= 3) return "scale-150";
  if (level <= 5) return "scale-125";
  if (level <= 6) return "scale-110";
  return "scale-100";
};

type PublicCapsuleMapProps = {
  location: {
    lat: number;
    lng: number;
  };
  myLocation: {
    lat: number;
    lng: number;
  } | null;
  data: PublicCapsule[];
  focus?: number;
  onClick: (id: number, lat: number, lng: number) => void;
};

export default function PublicCapsuleMap({
  location,
  myLocation,
  data,
  onClick,
  focus,
}: PublicCapsuleMapProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [level, setLevel] = useState(6);
  const router = useRouter();
  //props로 받은 location 위치가 바뀌면 지도 센터 좌표 변경
  useEffect(() => {
    //지도가 아직 안그려진 상태면 return
    if (!mapRef.current) return;
    const moveLatLng = new kakao.maps.LatLng(location.lat, location.lng);
    mapRef.current.setCenter(moveLatLng);
  }, [location]);

  return (
    <>
      <Map
        center={location} //중심 좌표
        level={level} //줌 레벨
        isPanto={true} //부드럽게 이동
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
        //생성 시 해당 지도 객체를 저장
        onCreate={(map) => {
          mapRef.current = map;
        }}
        onZoomChanged={(map) => {
          setLevel(map.getLevel());
        }}
      >
        {/* 내 위치 마커 */}
        {myLocation && (
          <CustomOverlayMap
            position={{
              lat: myLocation?.lat,
              lng: myLocation?.lng,
            }}
          >
            <div
              className={`border border-primary-2/90 rounded-full ${scaleClassByZoom(
                level
              )}`}
            >
              <div className="relative bg-primary-2/12 rounded-full w-12 h-12 ">
                <div className="absolute bg-primary-2 w-2 h-2 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </CustomOverlayMap>
        )}

        {/* 캡슐 위치 마커 */}
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={2} // 클러스터 할 최소 지도 레벨
          styles={[
            {
              // 1~9개
              width: "48px",
              height: "48px",
              background: "#FF583B",
              textAlign: "center",
              color: "#fff",
              borderRadius: "50%",
              lineHeight: "48px",
            },
            // {
            //   // 10~99개
            //   width: "48px",
            //   height: "48px",
            //   background: "#FF583B",
            //   textAlign: "center",
            //   color: "#fff",
            //   borderRadius: "50%",
            //   lineHeight: "48px",
            // },
            // {
            //   // 100개 이상
            //   width: "48px",
            //   height: "48px",
            //   background: "#FF583B",
            //   textAlign: "center",
            //   color: "#fff",
            //   borderRadius: "50%",
            //   lineHeight: "48px",
            // },
          ]}
          onClusterclick={onClusterclick}
        >
          {data?.map((d) => (
            <EventMarkerContainer
              key={d.capsuleId}
              position={{
                lat: d.capsuleLatitude,
                lng: d.capsuleLongitude,
              }}
              content={d.title}
              onClick={() =>
                onClick(d.capsuleId, d.capsuleLatitude, d.capsuleLongitude)
              }
              isFocus={!!(d.capsuleId === focus)}
              showCapsule={() => {
                router.push(`/dashboard/map?id=${d.capsuleId}`);
              }}
            />
          ))}
        </MarkerClusterer>
      </Map>
    </>
  );
}
