import { apiFetch } from "../fetchClient";

export const authApiClient = {
  login: (payload: { userId: string; password: string }) =>
    apiFetch<void>("/api/v1/auth/login", { method: "POST", json: payload }),

  signup: (payload: SignupRequest) =>
    apiFetch<SignupData>("/api/v1/auth/signup", {
      method: "POST",
      json: payload,
    }),

  me: (signal?: AbortSignal) =>
    apiFetch<MemberMe>("/api/v1/members/me", { signal }),

  logout: () => apiFetch<void>("/api/v1/auth/logout", { method: "POST" }),
};
