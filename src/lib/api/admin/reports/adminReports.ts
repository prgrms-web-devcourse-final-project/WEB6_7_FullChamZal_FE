import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): { status?: ReportStatus } {
  if (tab === "accepted") return { status: "ACCEPTED" };
  if (tab === "rejected") return { status: "REJECTED" };
  if (tab === "pending") return { status: "PENDING" };
  if (tab === "reviewing") return { status: "REVIEWING" };
  return {};
}

export const adminReportApi = {
  /* 신고 목록 조회 */
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
      ...(filters.status ? { status: filters.status } : {}),
    });

    // 검색어 정책이 있으면 유지
    const keyword = (params.query ?? "").trim();
    if (keyword) qs.set("keyword", keyword);

    return apiFetch<AdminReportResponse>(
      `/api/v1/admin/reports?${qs.toString()}`,
      { signal: params.signal }
    );
  },

  /* 신고 단건 조회 */
  get: (params: { reportId: number; signal?: AbortSignal }) => {
    return apiFetch<AdminReportDetail>(
      `/api/v1/admin/reports/${params.reportId}`,
      {
        signal: params.signal,
      }
    );
  },

  /* 신고 처리 상태 변경 */
  updateStatus: (params: {
    reportId: number;
    status: string;
    action: string;
    processMemo?: string | null;
    sanctionUntil?: string | null;
    signal?: AbortSignal;
  }) => {
    return apiFetch<UpdateReportStatusResponse>(
      `/api/v1/admin/reports/${params.reportId}/status`,
      {
        method: "PATCH",
        signal: params.signal,
        json: {
          status: params.status,
          action: params.action,
          processMemo: params.processMemo ?? null,
          sanctionUntil: params.sanctionUntil ?? null,
        },
      }
    );
  },
};
