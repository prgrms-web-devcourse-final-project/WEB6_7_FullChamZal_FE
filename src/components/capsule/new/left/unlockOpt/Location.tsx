"use client";

import { MapPin } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import KakaoLocation, { type KakaoLocationHandle } from "./KakaoLocation";

// 조회 반경
// const VIEWING_RADIUS_OPTIONS = [50, 100, 300, 500, 1000] as const;

export default function Location({
  value,
  onChange,
}: {
  value: LocationForm;
  onChange: (v: LocationForm) => void;
}) {
  const kakaoLocationRef = useRef<KakaoLocationHandle | null>(null);

  const canSearch = useMemo(() => Boolean(value.query?.trim()), [value.query]);

  const triggerSearch = useCallback(() => {
    if (!canSearch) return;
    kakaoLocationRef.current?.search();
  }, [canSearch]);

  return (
    <>
      <div className="flex items-center gap-1">
        <MapPin size={16} />
        <span className="text-sm">열람 가능 장소</span>
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

      {/* 선택 정보 표시 */}
      <div className="text-xs text-text-3">
        {!value.placeName ? "아직 선택된 장소가 없어요." : null}
      </div>

      <KakaoLocation
        query={value.query}
        value={value}
        ref={kakaoLocationRef}
        onPick={(picked) => {
          // 사용자가 별칭을 입력했다면 별칭을 자동으로 채우지 않음
          const prevLabel = value.locationLabel?.trim() ?? "";
          const shouldAutoFillLabel =
            !prevLabel || prevLabel === (value.placeName ?? "");

          onChange({
            ...value,
            query: picked.placeName || value.query,
            placeName: picked.placeName,
            locationLabel: shouldAutoFillLabel
              ? picked.placeName
              : value.locationLabel,
            address: picked.address,
            lat: picked.lat,
            lng: picked.lng,
          });
        }}
      />

      {/* 조회 반경 */}
      {/* <div className="flex flex-col space-y-2">
        <label>조회 반경 (m)</label>
        <div className="flex flex-wrap gap-2">
          {VIEWING_RADIUS_OPTIONS.map((r) => {
            const selected = value.viewingRadius === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onChange({ ...value, viewingRadius: r })}
                className={[
                  "flex-1 basis-0 min-w-[72px] px-3 py-2 rounded-lg text-sm border-2 transition text-center bg-white",
                  selected
                    ? "text-text-2 border-primary"
                    : "text-text-2 border-outline hover:border-primary/50",
                ].join(" ")}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div> */}

      {/* 사용자 지정 이름 */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="locationLabel">이 장소를 뭐라고 부를까요?</label>
        <input
          type="text"
          name="locationLabel"
          id="locationLabel"
          value={value.locationLabel}
          onChange={(e) =>
            onChange({ ...value, locationLabel: e.target.value })
          }
          placeholder="예) 우리가 처음 만난 카페, 약속 장소"
          className="w-full bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
        />
      </div>
    </>
  );
}
