"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, MarkerClusterer } from "react-kakao-maps-sdk";

const onClusterclick = () => {};

//마커 생성
const EventMarkerContainer = ({
  position,
  content,
  onClick,
  isFocus,
}: {
  position: { lat: number; lng: number };
  content: string;
  onClick: () => void;
  isFocus: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <CustomOverlayMap
      position={position}
      yAnchor={0}
      zIndex={isFocus ? 999 : 1}
    >
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

type PublicCapsuleMapProps = {
  location: {
    lat: number;
    lng: number;
  };
  data: PublicCapsule[];
  focus?: number;
  onClick: (id: number) => void;
};

export default function PublicCapsuleMap({
  location,
  data,
  onClick,
  focus,
}: PublicCapsuleMapProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);

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
        level={6} //줌 레벨
        isPanto={true} //부드럽게 이동
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
        //생성 시 해당 지도 객체를 저장
        onCreate={(map) => {
          mapRef.current = map;
        }}
      >
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
              onClick={() => onClick(d.capsuleId)}
              isFocus={!!(d.capsuleId === focus)}
            />
          ))}
        </MarkerClusterer>
      </Map>
    </>
  );
}
