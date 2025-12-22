// lib/api/bookmark/bookmarkApi.ts

import { apiFetch } from "../fetchClient";

export const bookmarkApi = {
  list: async (
    params: { page?: number; size?: number; sort?: string[] } = {},
    signal?: AbortSignal
  ) => {
    const sp = new URLSearchParams();
    sp.set("page", String(params.page ?? 0));
    sp.set("size", String(params.size ?? 10));
    (params.sort ?? ["bookmarkedAt,desc"]).forEach((s) => sp.append("sort", s));

    return apiFetch<PageResponse<BookmarkItem>>(
      `/api/bookmarks?${sp.toString()}`,
      {
        method: "GET",
        signal,
      }
    );
  },

  // 열람한 캡슐을 북마크에 추가하거나 삭제된 북마크를 복구
  upsert: (body: { capsuleId: number }, signal?: AbortSignal) => {
    return apiFetch<ApiResponse<null>>("/api/bookmarks", {
      method: "POST",
      json: body,
      signal,
    });
  },

  // 북마크 제거
  remove: (capsuleId: number, signal?: AbortSignal) => {
    return apiFetch<ApiResponse<null>>(`/api/bookmarks/${capsuleId}`, {
      method: "DELETE",
      signal,
    });
  },
};
