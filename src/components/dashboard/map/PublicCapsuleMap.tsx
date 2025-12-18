"use client";

import { useEffect, useRef } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";

type PublicCapsuleMapProps = {
  location: {
    lat: number;
    lng: number;
  };
  data: PublicCapsule[];
};
export default function PublicCapsuleMap({
  location,
  data,
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
        level={7} //줌 레벨
        isPanto={false} //부드럽게 이동
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
        //생성 시 해당 지도 객체를 저장
        onCreate={(map) => {
          mapRef.current = map;
        }}
      >
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={10} // 클러스터 할 최소 지도 레벨
        >
          {data?.map((d) => (
            <MapMarker
              key={d.capsuleId}
              position={{
                // 마커가 표시될 위치입니다
                lat: d.capsuleLatitude,
                lng: d.capsuleLongitude,
              }}
              image={{
                src: "/img/marker.png",
                size: {
                  width: 88,
                  height: 88,
                },
                options: {
                  offset: { x: 44, y: 44 },
                },
              }}
            />
          ))}
        </MarkerClusterer>
      </Map>
    </>
  );
}
