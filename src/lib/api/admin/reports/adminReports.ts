import { apiFetch } from "../../fetchClient";

export const adminReportApi = {
  /* 전화번호 인증 목록 조회 */
  list: (params: {
    tab: string;
    query: string;
    page: number;
    size: number;
    signal?: AbortSignal;
  }) => {
    const { tab, query, page, size, signal } = params;

    const qs = new URLSearchParams();
    qs.set("tab", tab);
    if (query) qs.set("query", query);
    qs.set("page", String(page));
    qs.set("size", String(size));

    return apiFetch<AdminReportResponse>(
      `/api/v1/admin/reports?${qs.toString()}`,
      {
        signal: signal,
      }
    );
  },
};
