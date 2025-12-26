import { apiFetch, apiFetchRaw } from "../fetchClient";

export const capsuleDashboardApi = {
  /* 보낸 편지 */
  sendDashboard: (signal?: AbortSignal) =>
    apiFetch<CapsuleDashboardItem[]>("/api/v1/capsule/send/dashboard", {
      signal,
    }),

  /* 보낸 편지 읽기 */
  readSendCapsule: (capsuleId: number, signal?: AbortSignal) =>
    apiFetch<CapsuleDashboardSendItem>(
      `/api/v1/capsule/readSendCapsule?capsuleId=${capsuleId}`,
      { signal }
    ),

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

    if (params?.sort && params.sort.length > 0) {
      sp.set("sort", JSON.stringify(params.sort));
    }

    const url = `/api/bookmarks?${sp.toString()}`;

    return apiFetchRaw<BookmarkPageResponse>(url, { signal });
  },

  /* 북마크 등록 */
  addBookmark: (capsuleId: number, signal?: AbortSignal) =>
    apiFetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capsuleId }),
      signal,
    }),

  /* 북마크 삭제 */
  removeBookmark: (capsuleId: number, signal?: AbortSignal) =>
    apiFetch(`/api/bookmarks/${capsuleId}`, {
      method: "DELETE",
      signal,
    }),
};
