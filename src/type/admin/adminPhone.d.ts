type AdminPhonePurpose = "SIGNUP" | "LOGIN" | "PASSWORD_RESET";

type AdminPhoneStatus = "PENDING" | "VERIFIED" | "EXPIRED";

type AdminPhone = {
  id: number;
  phoneNumberHash: string;
  purpose: AdminPhonePurpose;
  status: PhoneVerificationStatus;
  attemptCount: number;
  createdAt: string;
  verifiedAt: string | null;
  expiredAt: string | null;
};

type AdminPhoneResponse = ApiResponse<AdminPhone>;
