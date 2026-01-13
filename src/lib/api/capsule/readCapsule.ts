import { apiFetch } from "@/lib/api/fetchClient";

export const guestCapsuleApi = {
  // 편지 비밀번호 존재 여부 확인
  checkPassword: (params: ReadCapsuleRequest, signal?: AbortSignal) => {
    const query = new URLSearchParams({
      uuid: params.uuid,
    }).toString();

    return apiFetch<ApiResponse<ReadCapsulePasswordData>>(
      `/api/v1/capsule/readCapsule?${query}`,
      {
        method: "GET",
        signal,
      }
    );
  },

  // 검증 및 조회
  read: (body: CapsuleReadRequest, signal?: AbortSignal) => {
    return apiFetch<CapsuleReadData>("/api/v1/capsule/read", {
      method: "POST",
      json: body,
      signal,
    });
  },

  // 저장하기
  save: (body: CapsuleSaveRequest, signal?: AbortSignal) => {
    return apiFetch<ApiResponse<CapsuleSaveData>>("/api/v1/capsule/save", {
      method: "POST",
      json: body,
      signal,
    });
  },
};

export const storyTrackCapsuleApi = {
  // 검증 및 조회
  read: (
    params: { storytrackId: string },
    body: CapsuleReadRequest,
    signal?: AbortSignal
  ) => {
    const query = new URLSearchParams({
      storytrackId: params.storytrackId,
    }).toString();

    return apiFetch<CapsuleReadData>(
      `/api/v1/storytrack/participant/capsuleOpen?${query}`,
      {
        method: "POST",
        json: body,
        signal,
      }
    );
  },
};
