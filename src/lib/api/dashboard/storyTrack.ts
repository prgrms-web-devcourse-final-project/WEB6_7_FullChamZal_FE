import { apiFetchRaw } from "../fetchClient";

export const storyTrackApi = {
  /* 전체 스토리 트랙 리스트 */
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

  /* 스토리 트랙 참여 */
  participantStorytrack: (
    payload: { storytrackId: number },
    signal?: AbortSignal
  ) => {
    return apiFetchRaw<ApiResponse<{ message: string }>>(
      "/api/v1/storytrack/creat/participant",
      {
        method: "POST",
        json: payload,
        signal,
      }
    );
  },

  /* 스토리 트랙 참여 삭제 */
  deleteParticipantStorytrack: (
    params: { storytrackId: number },
    signal?: AbortSignal
  ) => {
    const sp = new URLSearchParams();
    sp.set("storytrackId", String(params.storytrackId));

    return apiFetchRaw<ApiResponse<{ message: string }>>(
      `/api/v1/storytrack/delete/participant?${sp.toString()}`,
      {
        method: "DELETE",
        signal,
      }
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

  /**
   * 내가 만든 장소 기반 공개 편지 목록 조회 (스토리트랙 생성용)
   * 장소 기반(LOCATION), 장소+시간 기반(TIME_AND_LOCATION) 공개 편지이 조회됩니다.
   * @param params 페이지네이션 파라미터
   */
  getCapsuleList: (
    params?: { page?: number; size?: number },
    signal?: AbortSignal
  ) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;

    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));

    return apiFetchRaw<PageResponse<CapsuleDashboardItem>>(
      `/api/v1/storytrack/creater/capsuleList?${sp.toString()}`,
      { signal }
    );
  },

  /**
   * 참여한 스토리트랙 목록 조회
   * @param params 페이지네이션 파라미터
   */
  joinedList: (
    params?: { page?: number; size?: number },
    signal?: AbortSignal
  ) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;

    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));

    return apiFetchRaw<StoryTrackJoinedListResponse>(
      `/api/v1/storytrack/participant/joinedList?${sp.toString()}`,
      { signal }
    );
  },

  /**
   * 내가 만든 스토리트랙 목록 조회
   * @param params 페이지네이션 파라미터
   */
  mineList: (
    params?: { page?: number; size?: number },
    signal?: AbortSignal
  ) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;

    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));

    return apiFetchRaw<StoryTrackMineListResponse>(
      `/api/v1/storytrack/creater/storytrackList?${sp.toString()}`,
      { signal }
    );
  },

  /**
   * 스토리트랙 상세 조회
   * @param params 편지id, 페이지네이션 파라미터
   */
  storyTrackDetail: (
    params?: { storytrackId?: string; page?: number; size?: number },
    signal?: AbortSignal
  ) => {
    const storytrackId = params?.storytrackId;
    const page = params?.page ?? 0;
    const size = params?.size ?? 100;

    const sp = new URLSearchParams();
    sp.set("storytrackId", String(storytrackId));
    sp.set("page", String(page));
    sp.set("size", String(size));

    return apiFetchRaw<StoryTrackDetailResponse>(
      `/api/v1/storytrack/dashboard?${sp.toString()}`,
      { method: "GET", signal }
    );
  },

  /**
   * 스토리트랙 진행 상세 조회
   * @param params 편지id 파라미터
   */
  storyTrackProgress: (
    params?: { storytrackId?: string },
    signal?: AbortSignal
  ) => {
    const storytrackId = params?.storytrackId;

    const sp = new URLSearchParams();
    sp.set("storytrackId", String(storytrackId));

    return apiFetchRaw<StoryTrackProgressResponse>(
      `/api/v1/storytrack/participant/progress?${sp.toString()}`,
      { method: "GET", signal }
    );
  },

  /**
   * 스토리트랙 경로 수정 (단일 step)
   * @param payload 경로 수정 요청 데이터
   */
  updatePath: (payload: UpdatePathRequest, signal?: AbortSignal) => {
    return apiFetchRaw<ApiResponse<UpdatePathResponse>>(
      "/api/v1/storytrack/update",
      {
        method: "PUT",
        json: payload,
        signal,
      }
    );
  },

  /**
   * 스토리트랙 삭제 (작성자)
   * @param payload 스토리트랙 ID
   */
  deleteStoryTrack: (
    payload: { storytrackId: number },
    signal?: AbortSignal
  ) => {
    const qs = new URLSearchParams({
      storytrackId: String(payload.storytrackId),
    });

    return apiFetchRaw<ApiResponse<{ storytrackId: number; message: string }>>(
      `/api/v1/storytrack/delete?${qs.toString()}`,
      {
        method: "DELETE",
        signal,
      }
    );
  },
};

export default storyTrackApi;
