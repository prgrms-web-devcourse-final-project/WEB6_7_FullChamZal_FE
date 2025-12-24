import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): { decision?: ModerationDecision } {
  if (tab === "skipped") return { decision: "SKIPPED" };
  if (tab === "error") return { decision: "ERROR" };
  if (tab === "flagged") return { decision: "FLAGGED" };
  return {};
}

function parseActorMemberId(query: string): number | undefined {
  const v = (query ?? "").trim();
  if (!v) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) return undefined;
  return n;
}

export const AdminModerationApi = {
  /* AI 검증 로그 목록 조회 */
  list: (params: {
    tab: string;
    query: string;
    page: number;
    size: number;
    signal?: AbortSignal;
  }) => {
    const filters = mapTabToFilters(params.tab);

    const qs = new URLSearchParams({
      page: String(params.page),
      size: String(params.size),
      ...(filters.decision ? { decision: filters.decision } : {}),
    });

    const actorMemberId = parseActorMemberId(params.query);
    if (actorMemberId !== undefined) {
      qs.set("actorMemberId", String(actorMemberId));
    }

    return apiFetch<AdminModerationResponse>(
      `/api/v1/admin/moderation-audit-logs?${qs.toString()}`,
      { signal: params.signal }
    );
  },

  get: (params: { id: number; signal?: AbortSignal }) => {
    return apiFetch<AdminModerationAuditLog>(
      `/api/v1/admin/moderation-audit-logs/${params.id}`,
      { signal: params.signal }
    );
  },
};
