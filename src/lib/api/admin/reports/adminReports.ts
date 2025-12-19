import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): { status?: ReportStatus } {
  if (tab === "accepted") return { status: "ACCEPTED" };
  if (tab === "rejected") return { status: "REJECTED" };
  if (tab === "pending") return { status: "PENDING" };
  if (tab === "reviewing") return { status: "REVIEWING" };
  return {};
}

export const adminReportApi = {
  /* 전화번호 인증 목록 조회 */
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
      ...(filters.status ? { status: filters.status } : {}),
    });

    const keyword = (params.query ?? "").trim();
    if (keyword) qs.set("keyword", keyword);

    return apiFetch<AdminReportResponse>(
      `/api/v1/admin/reports?${qs.toString()}`,
      {
        signal: params.signal,
      }
    );
  },
};
