import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): { visibility?: CapsuleVisibility } {
  if (tab === "public") return { visibility: "PUBLIC" };
  if (tab === "private") return { visibility: "PRIVATE" };
  return {};
}

export const adminCapsulesApi = {
  /* 편지 회원 목록 조회 */
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
      ...(filters.visibility ? { visibility: filters.visibility } : {}),
      sort: "createdAt,desc",
    });

    return apiFetch<AdminCapsulesResponse>(
      `/api/v1/admin/capsules?${qs.toString()}`,
      {
        signal: params.signal,
      }
    );
  },

  /* 편지 상세 조회 */
  detail: (params: { capsuleId: number; signal?: AbortSignal }) => {
    const { capsuleId, signal } = params;

    return apiFetch<AdminCapsuleDetailResponse>(
      `/api/v1/admin/capsules/${capsuleId}`,
      { signal }
    );
  },

  /* 편지 삭제 */
  toggleDelete: (params: {
    capsuleId: number;
    deleted: boolean;
    signal?: AbortSignal;
  }) => {
    const { capsuleId, deleted, signal } = params;

    return apiFetch<void>(`/api/v1/admin/capsules/${capsuleId}/delete`, {
      method: "PATCH",
      json: { deleted },
      signal,
    });
  },
};
