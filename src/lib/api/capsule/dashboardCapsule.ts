import { apiFetch, apiFetchRaw } from "../fetchClient";

export const capsuleDashboardApi = {
  /* 보낸 편지 */
  sendDashboard: (signal?: AbortSignal) =>
    apiFetch<CapsuleDashboardItem[]>("/api/v1/capsule/send/dashboard", {
      signal,
    }),

  /* 받은 편지 */
  receiveDashboard: (signal?: AbortSignal) =>
    apiFetch<CapsuleDashboardItem[]>("/api/v1/capsule/receive/dashboard", {
      signal,
    }),

  /* 북마크 편지 */
  bookmarks: (
    params?: { page?: number; size?: number; sort?: string[] },
    signal?: AbortSignal
  ) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 24;

    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));

    // ✅ 서버가 Swagger 예시처럼 JSON 배열 sort를 받는 경우
    if (params?.sort && params.sort.length > 0) {
      sp.set("sort", JSON.stringify(params.sort));
    }

    const url = `/api/bookmarks?${sp.toString()}`;

    return apiFetchRaw<BookmarkPageResponse>(url, { signal });
  },
};
