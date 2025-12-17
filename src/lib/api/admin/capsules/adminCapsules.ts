import { apiFetch } from "../../fetchClient";

export const adminCapsulesApi = {
  /* 캡슐 회원 목록 조회 */
  list: (params: {
    tab: string;
    query: string;
    page: number;
    size: number;
    signal?: AbortSignal;
  }) => {
    return apiFetch<AdminCapsulesResponse>(`/api/v1/admin/capsules`, {
      signal: params.signal,
    });
  },

  /* 캡슐 상세 조회 */
  detail: (params: { capsuleId: number; signal?: AbortSignal }) => {
    const { capsuleId, signal } = params;

    return apiFetch<AdminCapsuleDetailResponse>(
      `/api/v1/admin/capsules/${capsuleId}`,
      { signal }
    );
  },

  /* 캡슐 삭제 */
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
