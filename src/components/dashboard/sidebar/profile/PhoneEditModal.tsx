"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getMeDetail, updateMe } from "@/lib/api/members/members";
import { phoneVerificationApi } from "@/lib/api/phoneVerification";

const getErrorMessage = (e: unknown) => {
  if (e && typeof e === "object" && "message" in e) {
    return String((e as { message?: unknown }).message ?? "요청 실패");
  }
  return "요청 실패";
};

const digitsOnly = (v: string) => v.replace(/\D/g, "");
const isValidKrMobile = (v: string) => /^010\d{8}$/.test(digitsOnly(v));

export default function PhoneEditModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [initialPhone, setInitialPhone] = useState("");

  const [step, setStep] = useState<"INPUT" | "CODE">("INPUT");
  const [code, setCode] = useState("");

  const [cooldown, setCooldown] = useState(0);
  const [hasSent, setHasSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    setStep("INPUT");
    setCode("");
    setCooldown(0);
    setHasSent(false);
    setError(null);

    (async () => {
      setIsLoading(true);
      try {
        const me = await getMeDetail();
        if (!mounted) return;

        const value = me.phoneNumber ?? "";
        setPhone(value);
        setInitialPhone(value);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(e));
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (cooldown <= 0) return;

    const id = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(id);
  }, [open, cooldown]);

  const isPhoneChanged = digitsOnly(phone) !== digitsOnly(initialPhone);

  const canSend =
    isValidKrMobile(phone) &&
    isPhoneChanged &&
    cooldown === 0 &&
    !isSending &&
    !isLoading;

  const canConfirm =
    !!code.trim() &&
    isValidKrMobile(phone) &&
    isPhoneChanged &&
    !isConfirming &&
    !isSending &&
    !isSaving;

  const onSend = async () => {
    if (!canSend) return;

    const phoneNumber = digitsOnly(phone);

    setIsSending(true);
    setError(null);

    try {
      const res = await phoneVerificationApi.send({
        phoneNumber,
        purpose: "SIGNUP",
        resend: hasSent,
      });

      setHasSent(true);
      setStep("CODE");
      setCooldown(res.cooldownSeconds ?? 0);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setIsSending(false);
    }
  };

  const onConfirmAndSave = async () => {
    if (!canConfirm) return;

    const phoneNumber = digitsOnly(phone);

    setIsConfirming(true);
    setError(null);

    try {
      const confirmed = await phoneVerificationApi.confirm({
        phoneNumber,
        verificationCode: code,
        purpose: "SIGNUP",
      });

      if (!confirmed.verified) {
        setError("인증에 실패했습니다.");
        return;
      }

      setIsSaving(true);
      await updateMe({ phoneNumber });
      onClose();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setIsConfirming(false);
      setIsSaving(false);
    }
  };

  const onBackToInput = () => {
    setStep("INPUT");
    setCode("");
    setError(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-105 rounded-2xl border border-outline bg-white p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg">전화번호 수정</h4>
          <button onClick={onClose} className="cursor-pointer" type="button">
            <X />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <label className="text-sm">새 전화번호</label>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (step === "CODE") {
                setCode("");
                setError(null);
              }
            }}
            disabled={isLoading || isSending || isConfirming || isSaving}
            className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3 disabled:bg-gray-100 disabled:text-text-3"
            placeholder="전화번호를 입력해주세요"
          />

          {step === "INPUT" ? (
            <Button
              className="w-full py-3"
              onClick={onSend}
              disabled={!canSend}
            >
              {isSending
                ? "전송 중..."
                : cooldown > 0
                ? `${cooldown}s`
                : "인증번호 전송"}
            </Button>
          ) : (
            <>
              <label className="text-sm">인증번호</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onConfirmAndSave();
                }}
                disabled={isSending || isConfirming || isSaving}
                className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3 disabled:bg-gray-100 disabled:text-text-3"
                placeholder="인증번호를 입력해주세요"
              />

              <div className="flex gap-2">
                <Button
                  className="flex-1 py-3 border border-outline bg-white text-text hover:text-white"
                  type="button"
                  onClick={onBackToInput}
                  disabled={isSending || isConfirming || isSaving}
                >
                  이전
                </Button>

                <Button
                  className="flex-1 py-3"
                  onClick={onConfirmAndSave}
                  disabled={!canConfirm}
                >
                  {isSaving
                    ? "저장 중..."
                    : isConfirming
                    ? "확인 중..."
                    : "확인 후 저장"}
                </Button>
              </div>

              <Button
                className="w-full py-3 border border-outline bg-white text-text hover:text-white"
                type="button"
                onClick={onSend}
                disabled={!canSend}
              >
                {isSending
                  ? "전송 중..."
                  : cooldown > 0
                  ? `${cooldown}s`
                  : "인증번호 재전송"}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
