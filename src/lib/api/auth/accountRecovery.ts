import { apiFetchRaw } from "../fetchClient";



/** phone verification: SMS 발송 */
export type SendPhoneVerificationRequest = {
  phoneNumber: string;
  purpose: "FIND_ID" | "FIND_PW";
  resend?: boolean;
};

export type SendPhoneVerificationResponse = {
  success: boolean;
  cooldownSeconds: number;
};

/** phone verification: 코드 확인 */
export type ConfirmPhoneVerificationRequest = {
  phoneNumber: string;
  verificationCode: string;
  purpose: "FIND_ID" | "FIND_PW";
};

export type ConfirmPhoneVerificationResponse = {
  verified: boolean;
};

/** 아이디 찾기 */
export type FindUserIdRequest = {
  phoneNum: string;
};

export type FindUserIdResponse = {
  userId: string;
};

/** 비밀번호 재설정 */
export type FindPasswordRequest = {
  phoneNum: string;
  password: string;
};

export type FindPasswordResponse = {
    success: boolean;
};

export const accountRecoveryApi = {
  /**
   * SMS 인증 코드 발송
   * purpose: FIND_ID / FIND_PW
   */
  sendVerificationCode: (
    payload: SendPhoneVerificationRequest,
    signal?: AbortSignal
  ) => {
    return apiFetchRaw<ApiResponse<SendPhoneVerificationResponse>>(
      "/api/v1/phone-verification",
      {
        method: "POST",
        json: payload,
        signal,
      }
    );
  },

  /**
   * SMS 인증 코드 검증
   */
  confirmVerificationCode: (
    payload: ConfirmPhoneVerificationRequest,
    signal?: AbortSignal
  ) => {
    return apiFetchRaw<ApiResponse<ConfirmPhoneVerificationResponse>>(
      "/api/v1/phone-verification/confirm",
      {
        method: "POST",
        json: payload,
        signal,
      }
    );
  },

  /*
   * 사용자 로그인 아이디 찾기
   */
  findUserId: (payload: FindUserIdRequest, signal?: AbortSignal) => {
    return apiFetchRaw<ApiResponse<FindUserIdResponse>>("/api/v1/auth/findUserId", {
      method: "POST",
      json: payload,
      signal,
    });
  },

  /**
   * 사용자 비밀번호 재설정(찾기)
   */
  findPassword: (payload: FindPasswordRequest, signal?: AbortSignal) => {
    return apiFetchRaw<ApiResponse<FindPasswordResponse>>("/api/v1/auth/findPassword", {
      method: "PUT",
      json: payload,
      signal,
    });
  },
};
