"use client";

import Button from "@/components/common/tag/Button";

type Mode = "FIND_ID" | "FIND_PW";

export default function PhoneVerificationSection({
  mode,
  phoneNumber,
  setPhoneNumber,
  verificationCode,
  setVerificationCode,
  verified,
  cooldown,
  canSend,
  canConfirm,
  onSendCode,
  onConfirmCode,
  confirmPending,
}: {
  mode: Mode;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  verificationCode: string;
  setVerificationCode: (v: string) => void;
  verified: boolean;
  cooldown: number;
  canSend: boolean;
  canConfirm: boolean;
  onSendCode: () => void;
  onConfirmCode: () => void;
  confirmPending: boolean;
}) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm text-text-2">전화번호</label>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="01012345678"
          inputMode="numeric"
          autoComplete="tel"
          className="w-full p-4 bg-bg border border-outline rounded-xl outline-none focus:border-primary-2"
        />

        <div className="flex gap-2">
          <Button
            className="w-full py-3"
            onClick={onSendCode}
            disabled={!canSend || cooldown > 0}
          >
            {cooldown > 0 ? `재발송 (${cooldown}s)` : "인증번호 발송"}
          </Button>
        </div>

        {mode === "FIND_PW" && (
          <p className="text-xs text-text-3">
            비밀번호 재설정은 전화번호 인증 후 진행됩니다.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-2">인증번호</label>
        <div className="flex gap-2">
          <input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="flex-1 p-4 bg-bg border border-outline rounded-xl outline-none focus:border-primary-2"
          />
          <Button
            className="px-6 py-3"
            onClick={onConfirmCode}
            disabled={!canConfirm}
          >
            {confirmPending ? "확인 중..." : "인증 확인"}
          </Button>
        </div>

        {verified && (
          <div className="text-sm text-emerald-600">
            인증 완료. 다음 단계를 진행하세요.
          </div>
        )}
      </div>
    </>
  );
}
