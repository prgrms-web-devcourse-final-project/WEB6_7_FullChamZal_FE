"use client";

import { MapPin } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import KakaoLocation from "./KakaoLocation";

export default function Location({
  value,
  onChange,
}: {
  value: LocationForm;
  onChange: (v: LocationForm) => void;
}) {
  const [searchSignal, setSearchSignal] = useState(0);

  const canSearch = useMemo(() => Boolean(value.query?.trim()), [value.query]);

  const triggerSearch = useCallback(() => {
    if (!canSearch) return;
    setSearchSignal((prev) => prev + 1);
  }, [canSearch]);

  return (
    <>
      <div className="flex items-center gap-1">
        <MapPin size={16} />
        <span className="text-sm">장소 설정</span>
      </div>

      {/* 검색 입력 */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="unlockLocation">장소 검색</label>

        <div className="flex gap-2">
          <input
            type="text"
            name="unlockLocation"
            id="unlockLocation"
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              triggerSearch();
            }}
            placeholder="예) 서울역, 강남역, 카페 이름"
            className="w-full bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
          />

          {/* 검색 트리거 */}
          <button
            type="button"
            onClick={triggerSearch}
            disabled={!canSearch}
            className="cursor-pointer w-15 px-3 rounded-lg text-sm border border-outline bg-white disabled:opacity-50"
          >
            검색
          </button>
        </div>
      </div>

      {/* 선택된 장소 표시 */}
      <div className="text-xs text-text-3">
        {value.placeName ? (
          <>
            선택된 장소: <span className="text-text-2">{value.placeName}</span>
          </>
        ) : (
          "아직 선택된 장소가 없어요."
        )}
        {value.address ? (
          <div className="mt-1">
            주소: <span className="text-text-2">{value.address}</span>
          </div>
        ) : null}
        {typeof value.lat === "number" && typeof value.lng === "number" ? (
          <div className="mt-1">
            좌표:{" "}
            <span className="text-text-2">
              {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
            </span>
          </div>
        ) : null}
      </div>

      <KakaoLocation
        query={value.query}
        value={value}
        searchSignal={searchSignal}
        onPick={(picked) => {
          onChange({
            ...value,
            query: picked.placeName || value.query,
            placeName: picked.placeName,
            address: picked.address,
            lat: picked.lat,
            lng: picked.lng,
          });
        }}
      />
    </>
  );
}
