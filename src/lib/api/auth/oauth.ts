import { apiFetch } from "../fetchClient";

export type OauthSignupRequest = {
  nickname: string;
  phoneNumber: string;
};

export type OauthSignupResponse = Record<string, never>;

export async function oauthSignup(payload: OauthSignupRequest) {
  return apiFetch<OauthSignupResponse>("/api/v1/oauth/signup", {
    method: "POST",
    json: payload,
  });
}
