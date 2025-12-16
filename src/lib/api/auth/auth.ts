import { apiFetch } from "../fetchClient";

export const authApi = {
  login: (payload: { userId: string; password: string }) =>
    apiFetch<Record<string, never>>("/api/v1/auth/login", {
      method: "POST",
      json: payload,
    }),

  me: (signal?: AbortSignal) =>
    apiFetch<MemberMe>("/api/v1/members/me", { signal }),

  logout: () => apiFetch("/api/v1/auth/logout"),
};
