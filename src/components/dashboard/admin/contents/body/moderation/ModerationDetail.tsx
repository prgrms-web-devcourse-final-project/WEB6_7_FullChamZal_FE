/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/common/Modal";
import { AdminModerationApi } from "@/lib/api/admin/moderation/adminModeration";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";

type Props = {
  open: boolean;
  id: number | null;
  onClose: () => void;
};

export default function ModerationDetail({ open, id, onClose }: Props) {
  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminModerationDetail", id],
    enabled: open && !!id,
    queryFn: ({ signal }) =>
      AdminModerationApi.get({ id: id as number, signal }),
  });

  const detail = data;

  const raw = useMemo(() => {
    if (!detail?.rawResponseJson) return null;
    try {
      return JSON.parse(detail.rawResponseJson);
    } catch {
      return null;
    }
  }, [detail?.rawResponseJson]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative z-10 w-[min(920px,92vw)] max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="shrink-0 flex items-center justify-between border-b px-5 py-4 bg-white">
          <div>
            <div className="text-lg font-semibold">검증 로그 상세</div>
            {detail?.id ? (
              <div className="text-sm text-gray-500">Log #{detail.id}</div>
            ) : null}
          </div>

          <button
            className="rounded-lg p-2 hover:bg-gray-100"
            onClick={onClose}
            aria-label="close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 px-5 py-4 space-y-4 overflow-y-auto">
          {isLoading && (
            <div className="text-sm text-gray-600">불러오는 중…</div>
          )}

          {isError && (
            <div className="text-sm text-red-600">
              불러오기 실패: {String((error as any)?.message ?? "")}
            </div>
          )}

          {!isLoading && !isError && detail && (
            <>
              {/* 기본 정보 */}
              <section className="rounded-xl border p-4">
                <div className="text-sm font-semibold mb-3">기본 정보</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Item label="생성 시간" value={detail.createdAt} />
                  <Item
                    label="캡슐 ID"
                    value={String(detail.capsuleId ?? "-")}
                  />
                  <Item
                    label="액터 회원 ID"
                    value={String(detail.actorMemberId)}
                  />
                  <Item label="액션 타입" value={detail.actionType} />
                  <Item label="결정" value={detail.decision} />
                  <Item
                    label="플래그"
                    value={detail.flagged ? "true" : "false"}
                  />
                  <Item label="모델" value={detail.model} />
                  <Item label="inputHash" value={detail.inputHash} mono />
                </div>

                {detail.errorMessage ? (
                  <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    <div className="font-semibold mb-1">errorMessage</div>
                    <div className="whitespace-pre-wrap">
                      {detail.errorMessage}
                    </div>
                  </div>
                ) : null}
              </section>

              {/* rawResponseJson 요약 */}
              <section className="rounded-xl border p-4">
                <div className="text-sm font-semibold mb-3">
                  모더레이션 결과 요약
                </div>

                {!raw ? (
                  <div className="text-sm text-gray-600">
                    rawResponseJson 파싱 실패(문자열 형식 확인 필요)
                  </div>
                ) : (
                  <div className="space-y-4">
                    <SummaryBlock title="overall" obj={raw.overall} />
                    <SummaryBlock title="byField" obj={raw.byField} />
                  </div>
                )}
              </section>

              {/* rawResponseJson 원문 */}
              <section className="rounded-xl border p-4">
                <div className="text-sm font-semibold mb-3">
                  rawResponseJson (원문)
                </div>
                <pre className="text-xs whitespace-pre-wrap wrap-break-word rounded-lg bg-gray-50 p-3 overflow-auto">
                  {detail.rawResponseJson}
                </pre>
              </section>
            </>
          )}

          {!isLoading && !isError && !detail && (
            <div className="text-sm text-gray-600">데이터가 없습니다.</div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Item({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-sm ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function SummaryBlock({ title, obj }: { title: string; obj: any }) {
  const first = obj?.results?.[0];
  const flagged = first?.flagged;

  const categories = first?.categories;
  const scores = first?.category_scores;

  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {typeof flagged === "boolean" ? (
          <div
            className={`text-xs font-semibold ${
              flagged ? "text-orange-600" : "text-green-700"
            }`}
          >
            {flagged ? "FLAGGED" : "PASS"}
          </div>
        ) : null}
      </div>

      {/* categories */}
      {categories ? (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">categories</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories)
              .filter(([, v]) => v === true)
              .map(([k]) => (
                <span
                  key={k}
                  className="rounded-full bg-white border px-2 py-0.5 text-xs"
                >
                  {k}
                </span>
              ))}
          </div>
        </div>
      ) : null}

      {/* score top */}
      {scores ? (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">top scores</div>
          <div className="text-xs grid grid-cols-2 gap-1">
            {Object.entries(scores)
              .sort((a, b) => Number(b[1]) - Number(a[1]))
              .slice(0, 6)
              .map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-gray-700">{k}</span>
                  <span className="font-mono text-gray-900">
                    {Number(v).toFixed(3)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
