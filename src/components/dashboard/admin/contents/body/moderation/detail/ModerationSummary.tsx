"use client";

import SummaryBlock from "./SummaryBlock";

const FIELD_LABEL: Record<string, string> = {
  TITLE: "제목",
  CONTENT: "내용",
  RECEIVER_NICKNAME: "수신자 닉네임",
  LOCATION_NAME: "장소명",
  ADDRESS: "주소",
};

export default function ModerationSummary({
  raw,
}: {
  raw: ModerationRaw | null;
}) {
  if (!raw) {
    return (
      <section className="rounded-xl border p-4">
        <div className="text-sm font-semibold mb-3">모더레이션 결과 요약</div>
        <div className="text-sm text-gray-600">
          rawResponseJson 파싱 실패(문자열 형식 확인 필요)
        </div>
      </section>
    );
  }

  const flaggedFields = Object.entries(raw.byField).filter(
    ([, group]) => group?.results?.[0]?.flagged === true
  );

  return (
    <section className="rounded-xl border p-4 space-y-4">
      <div className="text-sm font-semibold">모더레이션 결과 요약</div>

      <SummaryBlock title="전체" obj={raw.overall} />

      {flaggedFields.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-800">
            문제 발생 필드
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {flaggedFields.map(([fieldKey, group]) => (
              <SummaryBlock
                key={fieldKey}
                title={FIELD_LABEL[fieldKey] ?? fieldKey}
                obj={group}
              />
            ))}
          </div>
        </div>
      )}

      {flaggedFields.length === 0 && (
        <div className="text-sm text-gray-600">
          개별 필드에서는 추가 위험이 감지되지 않았습니다.
        </div>
      )}
    </section>
  );
}
