import { apiFetch } from "./fetchClient";

export type PhonePurpose = "SIGNUP";

export type SendPhoneVerificationRequest = {
  phoneNumber: string;
  purpose: PhonePurpose;
  resend: boolean;
};

export type SendPhoneVerificationData = {
  success: boolean;
  cooldownSeconds: number;
};

export type ConfirmPhoneVerificationRequest = {
  phoneNumber: string;
  verificationCode: string;
  purpose: PhonePurpose;
};

export type ConfirmPhoneVerificationData = {
  verified: boolean; 
};

const BASE = "/api/v1/phone-verification";

export const phoneVerificationApi = {
  send: (payload: SendPhoneVerificationRequest) =>
    apiFetch<SendPhoneVerificationData>(BASE, {
      method: "POST",
      json: payload,
    }),

  confirm: (payload: ConfirmPhoneVerificationRequest) =>
    apiFetch<ConfirmPhoneVerificationData>(`${BASE}/confirm`, {
      method: "POST",
      json: payload,
    }),
};
