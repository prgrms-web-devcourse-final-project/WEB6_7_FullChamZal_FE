import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): { status?: AdminStatus } {
  if (tab === "active") return { status: "ACTIVE" };
  if (tab === "stop") return { status: "STOP" };
  return {};
}

export const adminUsersApi = {
  /* 관리자 회원 목록 조회 */
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

    return apiFetch<AdminUsersResponse>(
      `/api/v1/admin/members?${qs.toString()}`,
      { signal: params.signal }
    );
  },

  /* 회원 상태 변경 (ACTIVE ↔ STOP) */
  toggleStatus: (params: { id: number; nextStatus: AdminStatus }) => {
    return apiFetch<void>(`/api/v1/admin/members/${params.id}/status`, {
      method: "PATCH",
      json: { status: params.nextStatus },
    });
  },
};
