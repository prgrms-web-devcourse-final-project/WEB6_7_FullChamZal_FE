import { apiFetch } from "@/lib/api/fetchClient";

export const guestCapsuleApi = {
  // 캡슐 비밀번호 존재 여부 확인
  checkPassword: (params: ReadCapsuleRequest, signal?: AbortSignal) => {
    return apiFetch<ApiResponse<ReadCapsulePasswordData>>(
      "/api/v1/capsule/readCapsule",
      {
        method: "POST",
        json: params,
        signal,
      }
    );
  },
  read: (body: CapsuleReadRequest, signal?: AbortSignal) => {
    return apiFetch<ApiResponse<CapsuleReadData>>("/api/v1/capsule/read", {
      method: "POST",
      json: body,
      signal,
    });
  },
};
