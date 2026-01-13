import { apiFetch, apiFetchRaw } from "../fetchClient";

export const capsuleDashboardApi = {
  /* 오늘 해제될 편지 조회 */
  dailyUnlocked: (signal?: AbortSignal) => {
    return apiFetchRaw<DailyUnlockedCapsuleResponse>(
      "/api/v1/capsule/dailyUnlockedCapsule",
      { signal }
    );
  },

  /* 올 해 송수신 한 편지들의 수 */
  yearLetters: (year: number, signal?: AbortSignal) => {
    const sp = new URLSearchParams();
    sp.set("year", String(year));

    return apiFetchRaw<YearlyCapsuleResponse>(
      `/api/v1/capsule/showYearlyCapsule?${sp.toString()}`,
      { signal }
    );
  },

  /* 보낸 편지 */
  sendDashboard: (
    params?: { page?: number; size?: number; sort?: string[] },
    signal?: AbortSignal
  ) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;

    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));
    params?.sort?.forEach((s) => sp.append("sort", s));

    return apiFetchRaw<PageResponse<CapsuleDashboardItem>>(
      `/api/v1/capsule/send/dashboard?${sp.toString()}`,
      { signal }
    );
  },

  /* 보낸 편지 읽기 */
  readSendCapsule: (capsuleId: number, signal?: AbortSignal) =>
    apiFetch<CapsuleDashboardSendItem>(
      `/api/v1/capsule/readSendCapsule?capsuleId=${capsuleId}`,
      { signal }
    ),

  /* 받은 편지 */
  receiveDashboard: (
    params?: { page?: number; size?: number; sort?: string[] },
    signal?: AbortSignal
  ) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;

    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));
    params?.sort?.forEach((s) => sp.append("sort", s));

    return apiFetchRaw<PageResponse<CapsuleDashboardItem>>(
      `/api/v1/capsule/receive/dashboard?${sp.toString()}`,
      { signal }
    );
  },

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
