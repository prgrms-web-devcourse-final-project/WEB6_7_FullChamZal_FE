import FilterRow from "./FilterRow";
import { AccessibleFilter } from "./MapContents";

export default function FilterArea({
  radius,
  onRadiusChange,
  viewed,
  onViewedChange,
  accessible,
  onAccessibleChange,
  onReset,
  onClose,
}: {
  radius: Radius;
  onRadiusChange: (v: Radius) => void;
  viewed: ViewedFilter;
  onViewedChange: (v: ViewedFilter) => void;
  accessible: AccessibleFilter;
  onAccessibleChange: (v: AccessibleFilter) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-outline bg-white shadow-lg p-4 space-y-4 z-50">
      {/* 반경 선택 */}
      <div className="space-y-2">
        <p className="text-sm text-text-2">반경 선택</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { label: "1.5km", value: 1500 },
              { label: "1km", value: 1000 },
              { label: "500m", value: 500 },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onRadiusChange(opt.value)}
              className={`px-3 py-2 rounded-lg text-sm border transition
                ${
                  radius === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-outline text-text-2 hover:border-primary/50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 조회 유무 */}
      <div className="space-y-2">
        <p className="text-sm text-text-2">조회 유무</p>

        <div className="space-y-1">
          <FilterRow
            label="전체"
            active={viewed === "ALL"}
            onClick={() => onViewedChange("ALL")}
          />
          <FilterRow
            label="안 본 편지만"
            active={viewed === "UNREAD"}
            onClick={() => onViewedChange("UNREAD")}
          />
          <FilterRow
            label="본 편지만"
            active={viewed === "READ"}
            onClick={() => onViewedChange("READ")}
          />
        </div>
      </div>

      {/* 조회 가능 여부 */}
      <div className="space-y-2">
        <p className="text-sm text-text-2">조회 가능 여부</p>

        <div className="space-y-1">
          <FilterRow
            label="전체"
            active={accessible === "ALL"}
            onClick={() => onAccessibleChange("ALL")}
          />
          <FilterRow
            label="열람 가능"
            active={accessible === "ACCESSIBLE"}
            onClick={() => onAccessibleChange("ACCESSIBLE")}
          />
          <FilterRow
            label="열람 불가능"
            active={accessible === "INACCESSIBLE"}
            onClick={() => onAccessibleChange("INACCESSIBLE")}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="pt-2 flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full py-2 rounded-lg border border-outline text-sm hover:bg-sub transition"
        >
          초기화
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-primary text-white text-sm hover:opacity-90 transition"
        >
          적용
        </button>
      </div>
    </div>
  );
}
