import { apiFetchRaw } from "../fetchClient";

export const storyTrackApi = {
  allList: (
    params?: { page?: number; size?: number },
    signal?: AbortSignal
  ) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;

    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));

    return apiFetchRaw<StoryTrackListResponse>(
      `/api/v1/storytrack/List?${sp.toString()}`,
      { signal }
    );
  },

  /**
   * 스토리트랙 생성 API 호출
   * @param payload 스토리트랙 생성 요청 데이터
   */
  createStorytrack: (
    payload: CreateStorytrackRequest,
    signal?: AbortSignal
  ) => {
    return apiFetchRaw<ApiResponse<CreateStorytrackResponse>>(
      "/api/v1/storytrack/creat",
      {
        method: "POST",
        json: payload,
        signal,
      }
    );
  },
};
