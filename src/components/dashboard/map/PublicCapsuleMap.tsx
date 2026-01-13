"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, MarkerClusterer } from "react-kakao-maps-sdk";

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
      <div className={`relative flex flex-col items-center`} onClick={onClick}>
        {/* title */}
        <div
          className={`absolute bottom-full mb-2 p-3 text-sm rounded-lg shadow bg-bg ${
            isVisible || isFocus
              ? "opacity-100 cursor-pointer"
              : "opacity-0 pointer-none pointer-events-none"
          }`}
          onClick={showCapsule}
        >
          {content}
        </div>

        <div
          className={`flex items-center justify-center w-11 h-11 rounded-full ${
            isFocus ? "bg-primary scale-[1.2]" : "bg-primary-2"
          }`}
          onClick={onClick}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <MapPin color="white"></MapPin>
        </div>
      </div>
    </CustomOverlayMap>
  );
};

type PublicCapsuleMapProps = {
  radius: Radius;
  location: {
    lat: number;
    lng: number;
  };
  myLocation: {
    lat: number;
    lng: number;
  } | null;
  data: PublicCapsule[];
  focus: { id: number; ts: number } | null;
  onClick: (id: number, lat: number, lng: number) => void;
};

export default function PublicCapsuleMap({
  radius,
  location,
  myLocation,
  data,
  onClick,
  focus,
}: PublicCapsuleMapProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const circleRef = useRef<kakao.maps.Circle | null>(null);
  const router = useRouter();
  const [mapReady, setMapReady] = useState(false);

  //props로 받은 location 위치가 바뀌면 지도 센터 좌표 변경, 내 반경 원 그리기
  useEffect(() => {
    //지도가 아직 안그려진 상태면 return
    if (!mapRef.current) return;
    const moveLatLng = new kakao.maps.LatLng(location.lat, location.lng);
    mapRef.current.setCenter(moveLatLng);

    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    //내 위치 100m 반경 표시
    if (myLocation) {
      const circle = new kakao.maps.Circle({
        center: new kakao.maps.LatLng(myLocation?.lat, myLocation?.lng),
        radius: Number(radius),
        strokeWeight: 2,
        strokeColor: "#FF583B",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
        fillColor: "#FF583B",
        fillOpacity: 0.12,
      });
      circle.setMap(mapRef.current);
      circleRef.current = circle;
      return () => circle.setMap(null);
    }
  }, [radius, location, myLocation, mapReady]);

  useEffect(() => {
    if (!focus || !mapRef.current) return;
    if (focus) {
      mapRef.current.setLevel(1, { animate: true });
    }
  }, [data, focus, mapReady]);

  return (
    <>
      <Map
        center={location} //중심 좌표
        level={6} //줌 레벨
        isPanto={true} //부드럽게 이동
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
        //생성 시 해당 지도 객체를 저장
        onCreate={(map) => {
          mapRef.current = map;
          setMapReady(true);
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
            <div className="relative w-6 h-6">
              <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-primary/30" />
              <span className="absolute left-1/2 top-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </CustomOverlayMap>
        )}

        {/* 편지 위치 마커 */}
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
          ]}
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
              isFocus={!!(d.capsuleId === focus?.id)}
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
