import { apiFetch } from "./fetchClient";

export type MemberRole = "USER" | "ADMIN";

export type MemberMe = {
  memberId: number;
  userId: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  status: string; 
  role: MemberRole;
  createdAt: string;
};

export const authApi = {
  login: (payload: { userId: string; password: string }) =>
    apiFetch<Record<string, never>>("/api/v1/auth/login", {
      method: "POST",
      json: payload,
    }),

  me: () => apiFetch<MemberMe>("/api/v1/members/me"),
};
