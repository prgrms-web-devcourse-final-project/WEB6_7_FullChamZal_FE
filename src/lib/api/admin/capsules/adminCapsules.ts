import { apiFetch } from "../../fetchClient";

function mapTabToFilters(tab: string): {
  visibility?: CapsuleVisibility;
  unlocked?: string;
} {
  switch (tab) {
    case "public":
      return { visibility: "PUBLIC" };
    case "private":
      return { visibility: "PRIVATE" };
    case "locked":
      return { unlocked: "false" };
    case "opened":
      return { unlocked: "true" };
    default:
      return {};
  }
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
      ...(filters.visibility ? { visibility: filters.visibility } : {}),
      ...(filters.unlocked !== undefined ? { unlocked: filters.unlocked } : {}),
      sort: "createdAt,desc",
    });

    const keyword = (params.query ?? "").trim();
    if (keyword) qs.set("keyword", keyword);

    return apiFetch<AdminCapsulesResponse>(
      `/api/v1/admin/capsules?${qs.toString()}`,
      { signal: params.signal }
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

    return apiFetch<void>(`/api/v1/admin/capsules/${capsuleId}/deleted`, {
      method: "PATCH",
      json: { deleted },
      signal,
    });
  },
};
