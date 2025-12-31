import { useRef } from "react";
import { CustomOverlayMap, Map } from "react-kakao-maps-sdk";

type TrackMapProps = {
  storytrackType?: "SEQUENTIAL" | "PARALLEL";
  capsuleList?: StoryTrackPathItem[];
};

export default function TrackMap({
  storytrackType,
  capsuleList,
}: TrackMapProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);

  // 지도 중심 좌표 계산 (초기 렌더링용)
  const mapCenter = () => {
    if (capsuleList && capsuleList?.length > 0) {
      const avgLat =
        capsuleList.reduce(
          (sum, item) => sum + item.capsule.unlock.location.locationLat,
          0
        ) / capsuleList.length;
      const avgLng =
        capsuleList.reduce(
          (sum, item) => sum + item.capsule.unlock.location.locationLng,
          0
        ) / capsuleList.length;
      return { lat: avgLat, lng: avgLng };
    } else {
      return { lat: 37.5665, lng: 126.978 }; // 서울시청 기본값
    }
  };

  const fitBoundsToMarkers = () => {
    if (!mapRef.current || !capsuleList || capsuleList.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();

    capsuleList.forEach((item) => {
      bounds.extend(
        new kakao.maps.LatLng(
          item.capsule.unlock.location.locationLat,
          item.capsule.unlock.location.locationLng
        )
      );
    });

    mapRef.current.setBounds(bounds);
  };

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <div className="flex-1 flex gap-4 min-h-0">
          <div className="w-full h-full overflow-y-auto space-y-4 pr-2">
            <Map
              center={mapCenter()}
              style={{ width: "100%", height: "100%" }}
              onCreate={(map) => {
                mapRef.current = map;
                fitBoundsToMarkers();
              }}
            >
              {/* 경로 마커들 */}
              {capsuleList
                ? capsuleList.map((item, index) => (
                    <CustomOverlayMap
                      key={item.capsule.capsuleId}
                      position={{
                        lat: item.capsule.unlock.location.locationLat,
                        lng: item.capsule.unlock.location.locationLng,
                      }}
                      zIndex={capsuleList?.length - index}
                    >
                      <div className="group relative flex flex-col items-center">
                        {/* 마커 */}
                        <div className="peer w-10 h-10 rounded-full bg-primary-2 border-2 border-white shadow-lg flex items-center justify-center">
                          {storytrackType === "SEQUENTIAL" ? (
                            <span className="text-white text-xs font-semibold">
                              {index + 1}
                            </span>
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        {/* 제목 툴팁 (호버 시) */}
                        <div className="absolute bottom-full mb-2 p-3 text-sm rounded-lg shadow bg-white opacity-0 peer-hover:z-100 peer-hover:opacity-100 transition-opacity">
                          {item.capsule.capsuleTitle}
                        </div>
                      </div>
                    </CustomOverlayMap>
                  ))
                : ""}
            </Map>
          </div>
        </div>
      </div>
    </>
  );
}
