import { apiFetch } from "../fetchClient";

export type MemberMe = {
  memberId: number;
  userId: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  status: "ACTIVE" | "INACTIVE" | string;
  role: "ADMIN" | "USER" | string;
  createdAt: string;
};

export type MemberMeDetail = {
  memberId: number;
  userId: string;
  name: string;
  nickname: string | null;
  phoneNumber: string | null;
  status: "ACTIVE" | string;
  role: "USER" | string;
  oauthProvider?: "GOOGLE" | "NONE" | string | null;
  createdAt?: string;
  updatedAt?: string;
};


export type UpdateMeRequest = Partial<{
  nickname: string;
  phoneNumber: string;
  currentPassword: string;
  newPassword: string;
}>;

export type UpdateMeResponse = {
  message: string;
  updatedFields: string[];
  nextNicknameChangeDate?: string;
};

export async function getMe() {
  return apiFetch<MemberMe>("/api/v1/members/me");
}

export async function getMeDetail() {
  return apiFetch<MemberMeDetail>("/api/v1/members/me/detail");
}

export async function updateMe(payload: UpdateMeRequest) {
  return apiFetch<UpdateMeResponse>("/api/v1/members/me", {
    method: "PUT",
    json: payload,
  });
}

export async function verifyMemberPassword(password: string) {
  return apiFetch<Record<string, never>>("/api/v1/members/verify", {
    method: "POST",
    json: { password },
  });
}


export async function deleteMe() {
  return apiFetch<Record<string, never>>("/api/v1/members/me", {
    method: "DELETE",
  });
}
