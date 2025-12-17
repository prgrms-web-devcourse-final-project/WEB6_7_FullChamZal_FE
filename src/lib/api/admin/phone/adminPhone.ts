import { apiFetch } from "../../fetchClient";

export const adminPhoneApi = {
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

    return apiFetch<AdminPhoneResponse>(
      `/api/v1/admin/phone-verifications?${qs.toString()}`,
      {
        signal: signal,
      }
    );
  },
};
