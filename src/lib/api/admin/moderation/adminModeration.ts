import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): { decision?: ModerationDecision } {
  if (tab === "pass") return { decision: "PASS" };
  if (tab === "error") return { decision: "ERROR" };
  if (tab === "flagged") return { decision: "FLAGGED" };
  return {};
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
      query: params.query ?? "",
      ...(filters.decision ? { decision: filters.decision } : {}),
    });

    const keyword = (params.query ?? "").trim();
    if (keyword) qs.set("keyword", keyword);

    return apiFetch<AdminReportResponse>(
      `/api/v1/admin/moderation-audit-logs?${qs.toString()}`,
      {
        signal: params.signal,
      }
    );
  },
};
