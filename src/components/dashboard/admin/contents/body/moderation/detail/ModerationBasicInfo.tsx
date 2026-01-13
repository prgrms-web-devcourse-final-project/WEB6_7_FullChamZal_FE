"use client";

import { formatDateTime } from "@/lib/hooks/formatDateTime";
import DetailItem from "./DetailItem";

export default function ModerationBasicInfo({
  detail,
}: {
  detail: AdminModerationAuditLog;
}) {
  return (
    <section className="rounded-xl border p-4">
      <div className="text-sm font-semibold mb-3">기본 정보</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <DetailItem
          label="생성 시간"
          value={formatDateTime(detail.createdAt)}
        />
        <DetailItem label="편지 ID" value={String(detail.capsuleId ?? "-")} />
        <DetailItem label="액터 회원 ID" value={String(detail.actorMemberId)} />
        <DetailItem label="액션 타입" value={detail.actionType} />
        <DetailItem label="결정" value={detail.decision} />
        <DetailItem label="플래그" value={detail.flagged ? "true" : "false"} />
        <DetailItem label="모델" value={detail.model} />
        <DetailItem label="inputHash" value={detail.inputHash} mono />
      </div>

      {detail.errorMessage ? (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <div className="font-semibold mb-1">errorMessage</div>
          <div className="whitespace-pre-wrap">{detail.errorMessage}</div>
        </div>
      ) : null}
    </section>
  );
}
