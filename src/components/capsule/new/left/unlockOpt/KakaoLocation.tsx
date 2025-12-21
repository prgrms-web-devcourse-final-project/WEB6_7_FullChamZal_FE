"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import {
  type KakaoGeocoderService,
  type KakaoNamespace,
  type KakaoPlaceItem,
  type KakaoPlacesService,
} from "@/lib/kakao/types";

function getKakao(): KakaoNamespace | null {
  const kakao = (window as unknown as { kakao?: KakaoNamespace })?.kakao;
  return kakao ?? null;
}

type PickedLocation = {
  lat: number;
  lng: number;
  placeName: string;
  address?: string;
};

type KakaoLocationProps = {
  query: string;
  searchSignal: number;
  value?: Partial<LocationForm>;
  onPick: (picked: PickedLocation) => void;
};

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

export default function KakaoLocation({
  query,
  searchSignal,
  value,
  onPick,
}: KakaoLocationProps) {
  const ready = useKakaoReady();

  const initialCenter = useMemo(() => {
    if (typeof value?.lat === "number" && typeof value?.lng === "number") {
      return { lat: value.lat, lng: value.lng };
    }
    // 기본: 서울 시청 근처
    return { lat: 37.5665, lng: 126.978 };
  }, [value?.lat, value?.lng]);

  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    initialCenter
  );
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    () =>
      typeof value?.lat === "number" && typeof value?.lng === "number"
        ? { lat: value.lat, lng: value.lng }
        : null
  );

  const [results, setResults] = useState<KakaoPlaceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placesRef = useRef<KakaoPlacesService | null>(null);
  const geocoderRef = useRef<KakaoGeocoderService | null>(null);

  useEffect(() => {
    if (!ready) return;
    const kakao = getKakao();
    const services = kakao?.maps?.services;
    if (!services) return;

    if (!placesRef.current) {
      placesRef.current = new services.Places();
    }
    if (!geocoderRef.current) {
      geocoderRef.current = new services.Geocoder();
    }
  }, [ready]);

  // 외부 value(lat/lng)가 바뀌면 지도도 동기화
  useEffect(() => {
    if (typeof value?.lat !== "number" || typeof value?.lng !== "number")
      return;
    setCenter({ lat: value.lat, lng: value.lng });
    setMarker({ lat: value.lat, lng: value.lng });
  }, [value?.lat, value?.lng]);

  const reverseGeocode = (lat: number, lng: number) => {
    const kakao = getKakao();
    const geocoder = geocoderRef.current;
    const services = kakao?.maps?.services;
    if (!services || !geocoder)
      return Promise.resolve<string | undefined>(undefined);

    return new Promise<string | undefined>((resolve) => {
      // coord2Address: (lng, lat) 순서 주의
      geocoder.coord2Address(lng, lat, (result, status) => {
        if (status !== services.Status.OK) {
          resolve(undefined);
          return;
        }
        const addr =
          result?.[0]?.road_address?.address_name ??
          result?.[0]?.address?.address_name;
        resolve(addr);
      });
    });
  };

  const handlePick = async (picked: PickedLocation) => {
    setCenter({ lat: picked.lat, lng: picked.lng });
    setMarker({ lat: picked.lat, lng: picked.lng });
    onPick(picked);
  };

  // 검색 트리거 (Location.tsx에서 버튼/엔터로 searchSignal 증가)
  // 결과 클릭 시 x/y를 lng/lat로 변환해서 onPick
  useEffect(() => {
    if (!ready) return;
    const kakao = getKakao();
    const places = placesRef.current;
    const services = kakao?.maps?.services;

    const q = query?.trim() ?? "";
    if (!q) {
      setResults([]);
      setError(null);
      return;
    }
    if (!services || !places) {
      setError("카카오 지도 서비스를 불러오지 못했습니다.");
      return;
    }

    setIsSearching(true);
    setError(null);

    places.keywordSearch(q, (data, status) => {
      setIsSearching(false);
      if (status !== services.Status.OK) {
        setResults([]);
        setError("검색 결과가 없어요. 다른 키워드로 시도해 주세요.");
        return;
      }
      setResults(data ?? []);
      setError(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchSignal, ready]);

  return (
    <div className="space-y-2">
      <div className="h-68 rounded-lg bg-sub-2 overflow-hidden">
        {ready ? (
          <Map
            center={center}
            level={5}
            style={{ width: "100%", height: "100%" }}
            // 클릭한 위치 좌표 가져오기
            onClick={async (_map, mouseEvent) => {
              const lat = mouseEvent.latLng.getLat();
              const lng = mouseEvent.latLng.getLng();

              setCenter({ lat, lng });
              setMarker({ lat, lng });

              const address = await reverseGeocode(lat, lng);
              const placeName = address ?? "지도에서 선택한 위치";

              await handlePick({ lat, lng, placeName, address });
            }}
          >
            {marker ? <MapMarker position={marker} /> : null}
          </Map>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-text-5">
            지도를 불러오는 중...
          </div>
        )}
      </div>

      <div className="text-xs text-text-3">
        지도에서 클릭하거나, 검색 결과에서 장소를 선택해 주세요.
      </div>

      {isSearching ? (
        <div className="text-xs text-text-4">검색 중...</div>
      ) : null}
      {error ? <div className="text-xs text-red-500">{error}</div> : null}

      {results.length ? (
        <div className="max-h-44 overflow-auto rounded-lg border border-outline bg-white">
          {results.map((item) => {
            const address = item.road_address_name || item.address_name || "";
            return (
              <button
                key={item.id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-sub-2 border-b border-outline last:border-b-0"
                onClick={() => {
                  // x/y(문자열)을 lng/lat(숫자)로 변환
                  const lat = Number(item.y);
                  const lng = Number(item.x);
                  handlePick({
                    lat,
                    lng,
                    placeName: item.place_name,
                    address,
                  });
                }}
              >
                <div className="text-sm text-text-2">{item.place_name}</div>
                {address ? (
                  <div className="text-xs text-text-4 mt-0.5">{address}</div>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
