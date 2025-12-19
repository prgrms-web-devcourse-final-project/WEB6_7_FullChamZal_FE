import { apiFetch } from "@/lib/api/fetchClient";

export const capsuleReadApi = {
  read: (payload: CapsuleReadRequest, signal?: AbortSignal) =>
    apiFetch<CapsuleReadResponse>("/api/v1/capsule/read", {
      method: "POST",
      json: payload,
      signal,
    }),
};
