import { apiFetch } from "../fetchClient";

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

export type SignupRequest = {
  userId: string;
  password: string;
  name: string;
  nickname: string;
  phoneNumber: string;
};

export type SignupData = {
  memberId: number;
  userId: string;
};

export const authApi = {
  login: (payload: { userId: string; password: string }) =>
    apiFetch<void>("/api/v1/auth/login", {
      method: "POST",
      json: payload,
    }),

  signup: (payload: SignupRequest) =>
    apiFetch<SignupData>("/api/v1/auth/signup", {
      method: "POST",
      json: payload,
    }),

  me: (signal?: AbortSignal) =>
    apiFetch<MemberMe>("/api/v1/members/me", { signal }),

  logout: () =>
    apiFetch<void>("/api/v1/auth/logout", {
      method: "POST",
    }),
};
