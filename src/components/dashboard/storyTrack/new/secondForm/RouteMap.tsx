"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { LocateFixed } from "lucide-react";
import { type KakaoNamespace } from "@/lib/kakao/types";

type Letter = {
  id: string;
  title: string;
  placeName?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  routeItems: Letter[];
  order: "ordered" | "free";
};

function getKakao(): KakaoNamespace | null {
  const kakao = (window as unknown as { kakao?: KakaoNamespace })?.kakao;
  return kakao ?? null;
}

function useKakaoReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | null = null;
    const startedAt = Date.now();

    const tryLoad = () => {
      const kakao = getKakao();
      if (!kakao?.maps) return false;

      // autoload=false 환경 대응
      if (typeof kakao.maps.load === "function") {
        kakao.maps.load(() => {
          if (cancelled) return;
          setReady(true);
        });
        return true;
      }

      setReady(true);
      return true;
    };

    if (tryLoad()) return;

    intervalId = window.setInterval(() => {
      const ok = tryLoad();
      const timeout = Date.now() - startedAt > 6000;
      if (ok || timeout) {
        if (intervalId) window.clearInterval(intervalId);
      }
    }, 100);

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  return ready;
}

export default function RouteMap({ routeItems, order }: Props) {
  const ready = useKakaoReady();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  // 위치 정보가 있는 경로만 필터링
  const validRouteItems = useMemo(
    () =>
      routeItems.filter(
        (item): item is Letter & { lat: number; lng: number } =>
          typeof item.lat === "number" &&
          typeof item.lng === "number" &&
          Number.isFinite(item.lat) &&
          Number.isFinite(item.lng)
      ),
    [routeItems]
  );

  // 지도 중심 좌표 계산 (초기 렌더링용)
  const mapCenter = useMemo(() => {
    if (validRouteItems.length === 0) {
      return { lat: 37.5665, lng: 126.978 }; // 서울시청 기본값
    }

    const avgLat =
      validRouteItems.reduce((sum, item) => sum + item.lat, 0) /
      validRouteItems.length;
    const avgLng =
      validRouteItems.reduce((sum, item) => sum + item.lng, 0) /
      validRouteItems.length;

    return { lat: avgLat, lng: avgLng };
  }, [validRouteItems]);

  // 모든 마커가 보이도록 bounds 설정
  useEffect(() => {
    if (!mapRef.current || validRouteItems.length === 0) return;

    // kakao.maps는 전역 객체로 사용
    const kakaoWindow = window as unknown as {
      kakao?: {
        maps?: {
          LatLng?: new (lat: number, lng: number) => unknown;
          LatLngBounds?: new () => {
            extend: (latlng: unknown) => void;
          };
        };
      };
    };
    const kakao = kakaoWindow.kakao;
    if (!kakao?.maps?.LatLngBounds || !kakao.maps.LatLng) return;

    // 모든 마커의 좌표로 bounds 생성
    const LatLngBounds = kakao.maps.LatLngBounds;
    const LatLng = kakao.maps.LatLng;
    const bounds = new LatLngBounds();
    validRouteItems.forEach((item) => {
      const latLng = new LatLng(item.lat, item.lng);
      bounds.extend(latLng);
    });

    // bounds에 패딩 추가
    mapRef.current.setBounds(bounds as kakao.maps.LatLngBounds, 50); // 50px 여백
  }, [validRouteItems]);

  // 내 위치로 이동
  const moveToMyLocation = () => {
    if (!navigator.geolocation) return;
    if (!mapRef.current) return;

    // kakao.maps는 전역 객체로 사용
    const kakaoWindow = window as unknown as {
      kakao?: {
        maps?: {
          LatLng?: new (lat: number, lng: number) => unknown;
        };
      };
    };
    const kakao = kakaoWindow.kakao;
    if (!kakao?.maps?.LatLng) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!kakao?.maps?.LatLng) return;
        const LatLng = kakao.maps.LatLng;
        const moveLatLng = new LatLng(latitude, longitude);
        mapRef.current?.setCenter(moveLatLng as kakao.maps.LatLng);
        mapRef.current?.setLevel(3);
      },
      () => {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  };

  if (!ready) {
    return (
      <div className="w-full h-full flex items-center justify-center text-text-4 text-sm">
        지도를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <Map
        center={mapCenter}
        level={validRouteItems.length > 0 ? 6 : 5}
        style={{ width: "100%", height: "100%" }}
        onCreate={(map) => {
          mapRef.current = map;
        }}
      >
        {/* 경로 마커들 */}
        {validRouteItems.map((item, index) => (
          <CustomOverlayMap
            key={item.id}
            position={{ lat: item.lat, lng: item.lng }}
            zIndex={validRouteItems.length - index} // 나중에 추가된 것이 위에
          >
            <div className="relative flex flex-col items-center">
              {/* 마커 */}
              <div className="w-10 h-10 rounded-full bg-primary-2 border-2 border-white shadow-lg flex items-center justify-center">
                {order === "ordered" ? (
                  <span className="text-white text-xs font-semibold">
                    {index + 1}
                  </span>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>

              {/* 제목 툴팁 (호버 시) */}
              <div className="absolute top-full mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 pointer-events-none transition-opacity">
                {item.title}
              </div>
            </div>
          </CustomOverlayMap>
        ))}
      </Map>

      {/* 내 위치로 이동 버튼 */}
      <button
        type="button"
        onClick={moveToMyLocation}
        className="absolute bottom-4 right-4 p-3 rounded-xl bg-white shadow-lg text-primary hover:bg-button-hover transition"
        aria-label="내 위치로 이동"
      >
        <LocateFixed size={20} />
      </button>
    </div>
  );
}
