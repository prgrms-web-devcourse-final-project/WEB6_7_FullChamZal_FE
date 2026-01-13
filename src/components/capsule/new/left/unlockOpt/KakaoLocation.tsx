"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LocateFixed } from "lucide-react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import {
  type KakaoGeocoderService,
  type KakaoNamespace,
  type KakaoPlaceItem,
  type KakaoPlacesService,
} from "@/lib/kakao/types";

/**
 * KakaoLocation
 *
 * 편지 생성(해제조건: 장소)에서 사용하는 카카오 지도/검색 컴포넌트.
 *
 * ## 제공 기능
 * - **지도 클릭으로 좌표 선택**: 클릭한 위치의 lat/lng를 얻어 `onPick`으로 전달
 * - **장소 검색(키워드 검색)**: Kakao Places `keywordSearch`로 결과를 조회하고 리스트 UI로 표시
 * - **내 위치로 이동 버튼**: Geolocation으로 현재 위치를 받아 지도 중심을 이동
 * - **조회 반경 시각화**: `value.viewingRadius`와 `value.lat/lng`가 있을 때 지도 위에 `kakao.maps.Circle`로 반경 원 표시
 *
 * ## 부모-자식 트리거 방식(ref)
 * 이 컴포넌트는 검색 실행을 `useImperativeHandle`로 노출합니다.
 * - 부모(`Location.tsx`)에서 `ref.current?.search()`를 호출하면 현재 `query`로 검색을 실행하고 결과 리스트를 갱신합니다.
 *
 * @example
 * const ref = useRef<KakaoLocationHandle>(null);
 * <KakaoLocation ref={ref} query={query} value={value} onPick={...} />
 * ref.current?.search();
 */
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
  value?: Partial<LocationForm>;
  onPick: (picked: PickedLocation) => void;
};

export type KakaoLocationHandle = {
  search: () => void;
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

const KakaoLocation = forwardRef<KakaoLocationHandle, KakaoLocationProps>(
  ({ query, value, onPick }, ref) => {
    const ready = useKakaoReady();
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const circleRef = useRef<kakao.maps.Circle | null>(null);

    const [center, setCenter] = useState<{ lat: number; lng: number }>(() => {
      if (typeof value?.lat === "number" && typeof value?.lng === "number") {
        return { lat: value.lat, lng: value.lng };
      }
      // 기본: 서울 시청
      return { lat: 37.5665, lng: 126.978 };
    });
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
      () =>
        typeof value?.lat === "number" && typeof value?.lng === "number"
          ? { lat: value.lat, lng: value.lng }
          : null
    );

    const [results, setResults] = useState<KakaoPlaceItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
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

    // 반경 원 오버레이 동기화(React 값(value.*) <-> 외부 시스템(kakao map overlay))
    useEffect(() => {
      const lat =
        typeof value?.lat === "number" ? (value.lat as number) : undefined;
      const lng =
        typeof value?.lng === "number" ? (value.lng as number) : undefined;
      const radius =
        typeof value?.viewingRadius === "number"
          ? (value.viewingRadius as number)
          : undefined;

      // 좌표/반경이 없으면 원 제거
      if (typeof lat !== "number" || typeof lng !== "number" || !radius) {
        if (circleRef.current) {
          circleRef.current.setMap(null);
          circleRef.current = null;
        }
        return;
      }

      if (!ready || !map) return;

      const centerLatLng = new kakao.maps.LatLng(lat, lng);

      if (!circleRef.current) {
        circleRef.current = new kakao.maps.Circle({
          center: centerLatLng,
          radius,
          strokeWeight: 2,
          strokeColor: "#FF583B",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
          fillColor: "#FF583B",
          fillOpacity: 0.12,
        });
        circleRef.current.setMap(map);
        return;
      }

      circleRef.current.setPosition(centerLatLng);
      circleRef.current.setRadius(radius);
      circleRef.current.setMap(map);
    }, [ready, map, value?.lat, value?.lng, value?.viewingRadius]);

    // 언마운트 시 원 정리
    useEffect(() => {
      return () => {
        if (circleRef.current) {
          circleRef.current.setMap(null);
          circleRef.current = null;
        }
      };
    }, []);

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
      if (map) {
        const moveLatLng = new kakao.maps.LatLng(picked.lat, picked.lng);
        map.setCenter(moveLatLng);
      }
      onPick(picked);
    };

    // 검색,엔터 버튼으로 kakao places 검색 돌려서 검색결과 리스트 갱신
    useImperativeHandle(
      ref,
      () => ({
        search: () => {
          if (!ready) return;
          const kakao = getKakao();
          const places = placesRef.current;
          const services = kakao?.maps?.services;

          const q = query?.trim() ?? "";
          if (!q) return;

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
        },
      }),
      [query, ready]
    );

    // 내 위치로 지도 중심 이동 (선택값은 건드리지 않음)
    const moveToMyLocation = () => {
      if (!("geolocation" in navigator)) {
        setError("브라우저가 Geolocation을 지원하지 않습니다.");
        return;
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setError(null);
          setCenter(next);
          if (map) {
            const moveLatLng = new kakao.maps.LatLng(next.lat, next.lng);
            map.setCenter(moveLatLng);
          }
          setIsLocating(false);
        },
        () => {
          setError("현재 위치를 가져오지 못했어요. 위치 권한을 확인해 주세요.");
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60_000,
        }
      );
    };

    // 검색은 부모(Location.tsx)에서 ref.search()로 트리거한다.

    return (
      <div className="space-y-2">
        <div className="relative h-68 rounded-lg bg-sub-2 overflow-hidden">
          {ready ? (
            <Map
              center={
                typeof value?.lat === "number" && typeof value?.lng === "number"
                  ? { lat: value.lat, lng: value.lng }
                  : center
              }
              level={5}
              style={{ width: "100%", height: "100%" }}
              onCreate={(map) => {
                setMap(map);
              }}
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
              {(typeof value?.lat === "number" &&
                typeof value?.lng === "number") ||
              marker ? (
                <MapMarker
                  position={
                    typeof value?.lat === "number" &&
                    typeof value?.lng === "number"
                      ? { lat: value.lat, lng: value.lng }
                      : (marker as { lat: number; lng: number })
                  }
                />
              ) : null}
            </Map>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-text-5">
              지도를 불러오는 중...
            </div>
          )}

          {/* 내 위치로 이동 버튼 (우측 하단) */}
          <button
            type="button"
            onClick={moveToMyLocation}
            disabled={!ready || isLocating}
            aria-label="내 위치로 이동"
            className="cursor-pointer bg-bg absolute bottom-3 right-3 p-3 rounded-xl z-10 shadow-lg text-primary disabled:opacity-50"
          >
            <LocateFixed size={22} />
          </button>
        </div>

        <div className="text-xs text-text-3">
          지도에서 클릭하거나, 검색 결과에서 장소를 선택해 주세요.
        </div>

        {isSearching ? (
          <div className="text-xs text-text-4">검색 중...</div>
        ) : null}
        {error ? <div className="text-xs text-error">{error}</div> : null}

        {results.length ? (
          <div className="max-h-44 overflow-auto rounded-lg border border-outline bg-bg">
            {results.map((item) => {
              const address = item.road_address_name || item.address_name || "";
              return (
                <button
                  key={item.id}
                  type="button"
                  className="cursor-pointer w-full text-left px-3 py-2 hover:bg-sub-2 border-b border-outline last:border-b-0"
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
);

KakaoLocation.displayName = "KakaoLocation";

export default KakaoLocation;
