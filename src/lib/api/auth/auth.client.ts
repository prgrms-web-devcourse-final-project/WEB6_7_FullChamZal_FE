/* eslint-disable @typescript-eslint/no-explicit-any */
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

  isLoggedIn: async (signal?: AbortSignal) => {
    try {
      await apiFetch<MemberMe>("/api/v1/members/me", { signal });
      return true;
    } catch (e: any) {
      const status = e?.status ?? e?.response?.status;
      if (status === 401 || status === 403) return false;
      throw e;
    }
  },

  logout: () => apiFetch<void>("/api/v1/auth/logout", { method: "POST" }),
};
