import { apiFetch } from "./fetchClient";

export const authApi = {
  login: (payload: { userId: string; password: string }) =>
    apiFetch<Record<string, never>>("/api/v1/auth/login", {
      method: "POST",
      json: payload,
    }),

  
  me: () => apiFetch<unknown>("/api/v1/members/me"),
};