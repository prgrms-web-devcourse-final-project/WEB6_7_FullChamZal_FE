"use client";

import {
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Tag,
} from "lucide-react";

const MODERATION_CATEGORY_LABEL: Record<
  string,
  { title: string; desc: string }
> = {
  harassment: {
    title: "괴롭힘",
    desc: "욕설, 비하, 공격적인 표현",
  },
  "harassment/threatening": {
    title: "위협적 괴롭힘",
    desc: "신체적·정신적 위협을 포함한 공격",
  },
  sexual: {
    title: "성적 콘텐츠",
    desc: "성적 암시 또는 성적 표현",
  },
  "sexual/minors": {
    title: "미성년자 성적 콘텐츠",
    desc: "미성년자를 대상으로 한 성적 표현",
  },
  hate: {
    title: "혐오 표현",
    desc: "집단에 대한 차별·혐오 발언",
  },
  "hate/threatening": {
    title: "위협적 혐오 표현",
    desc: "폭력·위협을 동반한 혐오 발언",
  },
  violence: {
    title: "폭력",
    desc: "폭력 행위 또는 폭력을 조장하는 내용",
  },
  "violence/graphic": {
    title: "잔인한 폭력",
    desc: "피·신체 훼손 등 잔혹한 묘사",
  },
  illicit: {
    title: "불법 행위",
    desc: "불법 활동 또는 범죄 관련 내용",
  },
  "illicit/violent": {
    title: "폭력적 불법 행위",
    desc: "무기, 테러, 강력 범죄 관련 내용",
  },
  "self-harm": {
    title: "자해",
    desc: "자기 자신을 해치는 행위",
  },
  "self-harm/intent": {
    title: "자해 의도",
    desc: "자해·자살 의사를 명확히 표현",
  },
  "self-harm/instructions": {
    title: "자해 방법",
    desc: "자해·자살 방법에 대한 안내",
  },
};

type Risk = { label: string; color: string };

function getRiskLevel(score: number): Risk {
  if (score >= 0.8) return { label: "매우 높음", color: "text-red-600" };
  if (score >= 0.5) return { label: "높음", color: "text-orange-600" };
  if (score >= 0.2) return { label: "주의", color: "text-yellow-600" };
  return { label: "낮음", color: "text-green-700" };
}

function formatPct(score: number) {
  return `${Math.round(score * 100)}%`;
}

function sectionTitleToKorean(title: string) {
  if (title === "overall") return "전체(Overall)";
  if (title === "byField") return "필드별(ByField)";
  return title;
}

export default function SummaryBlock({
  title,
  obj,
}: {
  title: string;
  obj?: ModerationGroup | null;
}) {
  const first = obj?.results?.[0];
  const flagged = first?.flagged;

  const categories = first?.categories;
  const scores = first?.category_scores;

  const flaggedKeys = categories
    ? Object.entries(categories)
        .filter(([, v]) => v === true)
        .map(([k]) => k)
    : [];

  const topScores = scores
    ? Object.entries(scores)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 6)
    : [];

  const summaryLine = (() => {
    if (!first)
      return (
        <span className="flex items-center gap-1">
          <Info size={14} /> 분석 결과가 없습니다.
        </span>
      );

    if (flagged === false)
      return (
        <span className="flex items-center gap-1 text-green-700">
          <CheckCircle size={14} /> 유해 요소가 감지되지 않았습니다.
        </span>
      );

    if (!scores)
      return (
        <span className="flex items-center gap-1 text-orange-600">
          <AlertTriangle size={14} /> 유해 가능성이 감지되었습니다.
        </span>
      );

    const [topKey, topScore] = topScores[0] ?? [];
    const meta = topKey ? MODERATION_CATEGORY_LABEL[topKey] : null;
    if (!meta)
      return (
        <span className="flex items-center gap-1 text-orange-600">
          <AlertTriangle size={14} /> 유해 가능성이 감지되었습니다.
        </span>
      );

    const risk = getRiskLevel(Number(topScore));
    return (
      <span className="flex items-center gap-1">
        <AlertTriangle size={14} className={risk.color} />
        <span>
          {meta.title} 위험이 {risk.label} ({formatPct(Number(topScore))})
        </span>
      </span>
    );
  })();

  return (
    <div className="rounded-lg bg-gray-50 p-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold truncate">
          {sectionTitleToKorean(title)}
        </div>

        {typeof flagged === "boolean" ? (
          <div
            className={[
              "flex items-center gap-1 text-xs font-semibold shrink-0",
              flagged ? "text-orange-600" : "text-green-700",
            ].join(" ")}
          >
            {flagged ? (
              <>
                <AlertTriangle size={14} /> 검출됨
              </>
            ) : (
              <>
                <CheckCircle size={14} /> 통과
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Summary sentence */}
      <div className="mt-2 text-sm font-medium text-gray-900">
        {summaryLine}
      </div>

      {/* Flagged categories */}
      {categories && (
        <div className="mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Tag size={12} />
            검출된 항목
          </div>

          {flaggedKeys.length === 0 ? (
            <div className="text-xs text-gray-600">
              {flagged
                ? "표시된 카테고리는 없지만 점수로 검출될 수 있습니다."
                : "없음"}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {flaggedKeys.map((k) => {
                const meta = MODERATION_CATEGORY_LABEL[k];
                return (
                  <span
                    key={k}
                    className="rounded-full bg-white border px-2 py-0.5 text-xs"
                    title={meta?.desc ?? k}
                  >
                    {meta?.title ?? k}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Top scores */}
      {scores && (
        <div className="mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <TrendingUp size={12} />
            위험 점수 상위
          </div>

          <div className="space-y-1 text-sm">
            {topScores.map(([key, score]) => {
              const meta = MODERATION_CATEGORY_LABEL[key];
              const s = Number(score);
              const risk = getRiskLevel(s);

              return (
                <div
                  key={key}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {meta?.title ?? key}
                    </div>
                    {meta?.desc && (
                      <div className="text-xs text-gray-500 truncate">
                        {meta.desc}
                      </div>
                    )}
                  </div>

                  <div
                    className={`text-xs font-semibold shrink-0 ${risk.color}`}
                  >
                    {risk.label} · {formatPct(s)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!first && (
        <div className="mt-2 text-xs text-gray-600">results[0]가 없습니다.</div>
      )}
    </div>
  );
}
