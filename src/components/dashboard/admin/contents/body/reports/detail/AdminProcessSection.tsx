"use client";

type ReportAction = "NONE" | "HIDE_CAPSULE" | "SUSPEND_MEMBER";

const ACTION_OPTIONS: { value: ReportAction; label: string; hint?: string }[] =
  [
    {
      value: "NONE",
      label: "조치 없음",
      hint: "경고/기록만 남기고 조치하지 않음",
    },
    {
      value: "HIDE_CAPSULE",
      label: "편지 숨김",
      hint: "신고 대상 편지을 비노출 처리",
    },
    {
      value: "SUSPEND_MEMBER",
      label: "회원 정지",
      hint: "정지 해제 일시가 필요",
    },
  ];

export default function AdminProcessSection({
  actionable,
  isMutating,
  action,
  setAction,
  processMemo,
  setProcessMemo,
  sanctionUntilLocal,
  setSanctionUntilLocal,
}: {
  actionable: boolean;
  isMutating: boolean;

  action: ReportAction;
  setAction: (v: ReportAction) => void;

  processMemo: string;
  setProcessMemo: (v: string) => void;

  sanctionUntilLocal: string;
  setSanctionUntilLocal: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-outline p-4 space-y-3 md:space-y-4">
      <div className="text-sm font-semibold">관리자 처리</div>

      {/* 조치 타입 선택 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-text-3">조치 타입</div>

          {/* 선택된 값 칩 */}
          <span
            className={[
              "text-[11px] px-2 py-1 rounded-full border",
              action === "NONE"
                ? "bg-gray-50 text-gray-700 border-gray-200"
                : action === "HIDE_CAPSULE"
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-red-50 text-red-700 border-red-200",
            ].join(" ")}
          >
            {ACTION_OPTIONS.find((o) => o.value === action)?.label ?? action}
          </span>
        </div>

        <div className="relative">
          {/* 커스텀 화살표 */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              viewBox="0 0 20 20"
              className={[
                "h-4 w-4",
                !actionable || isMutating ? "text-gray-300" : "text-gray-500",
              ].join(" ")}
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <select
            className={[
              "w-full appearance-none rounded-xl border px-3 py-3 pr-10 text-sm outline-none transition",
              "bg-bg",
              !actionable || isMutating
                ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                : "border-outline hover:border-admin/40 focus:border-admin focus:ring-4 focus:ring-admin/15",
            ].join(" ")}
            value={action}
            onChange={(e) => setAction(e.target.value as ReportAction)}
            disabled={!actionable || isMutating}
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* 힌트 박스 */}
        <div
          className={[
            "rounded-lg border px-3 py-2 text-xs leading-relaxed",
            action === "NONE"
              ? "bg-gray-50 border-gray-200 text-gray-600"
              : action === "HIDE_CAPSULE"
              ? "bg-orange-50 border-orange-200 text-orange-700"
              : "bg-red-50 border-red-200 text-red-700",
          ].join(" ")}
        >
          {ACTION_OPTIONS.find((o) => o.value === action)?.hint ?? ""}
        </div>
      </div>

      {/* 처리 메모 */}
      <div className="space-y-1">
        <div className="text-xs text-text-3">처리 메모</div>
        <textarea
          className="w-full min-h-22.5 rounded-lg border border-outline p-3 text-sm outline-none focus:ring-2 focus:ring-admin/30 disabled:bg-gray-50"
          value={processMemo}
          onChange={(e) => setProcessMemo(e.target.value)}
          placeholder="처리 사유/근거를 남겨주세요. (선택)"
          disabled={!actionable || isMutating}
        />
      </div>

      {/* 제재 종료일: 회원정지일 때만 활성 */}
      <div className="space-y-1">
        <div className="text-xs text-text-3">
          제재 종료일 {action === "SUSPEND_MEMBER" ? "(필수)" : "(선택/미사용)"}
        </div>
        <input
          type="datetime-local"
          className="w-full rounded-lg border border-outline p-3 text-sm outline-none focus:ring-2 focus:ring-admin/30 disabled:bg-gray-50"
          value={sanctionUntilLocal}
          onChange={(e) => setSanctionUntilLocal(e.target.value)}
          disabled={!actionable || isMutating || action !== "SUSPEND_MEMBER"}
        />
      </div>
    </div>
  );
}
