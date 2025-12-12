import { MapPin } from "lucide-react";

export default function Location({
  value,
  onChange,
}: {
  value: LocationForm;
  onChange: (v: LocationForm) => void;
}) {
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
            placeholder="예) 서울역, 강남역, 카페 이름"
            className="w-full bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
          />

          {/* 입력한 값을 선택 처리 */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                placeName: value.query.trim(),
              })
            }
            disabled={!value.query.trim()}
            className="cursor-pointer w-15 px-3 rounded-lg text-sm border border-outline bg-white disabled:opacity-50"
          >
            선택
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
      </div>

      <div className="h-40 rounded-lg bg-sub-2 flex items-center justify-center text-xs text-text-5">
        지도 영역 (추가 예정)
      </div>
    </>
  );
}
