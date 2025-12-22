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
};
