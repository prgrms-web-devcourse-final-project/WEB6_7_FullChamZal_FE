import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): { status?: AdminPhoneStatus } {
  if (tab === "verified") return { status: "VERIFIED" };
  if (tab === "expired") return { status: "EXPIRED" };
  if (tab === "pending") return { status: "PENDING" };
  return {};
}

export const adminPhoneApi = {
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

    qs.set("sort", "id,desc");
    const keyword = (params.query ?? "").trim();
    if (keyword) qs.set("purpose", keyword);

    return apiFetch<AdminPhoneResponse>(
      `/api/v1/admin/phone-verifications?${qs.toString()}`,
      {
        signal: params.signal,
      }
    );
  },
};
