"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { phoneVerificationApi } from "@/lib/api/phoneVerification";
import { oauthSignup } from "@/lib/api/auth/oauth";

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

function formatPhone(v: string) {
  const d = digitsOnly(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

export default function OAuthProfileModal({
  open,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const initial = useMemo(
    () => ({
      nickname: "",
      phone: "",
      code: "",
    }),
    []
  );

  const [nickname, setNickname] = useState(initial.nickname);
  const [phone, setPhone] = useState(initial.phone);
  const [code, setCode] = useState(initial.code);

  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneDigits = digitsOnly(phone);
  const canSend = phoneDigits.length === 10 || phoneDigits.length === 11;
  const canConfirm =
    !!code.trim() && canSend && !isConfirming && !isSending && cooldown > 0;
  const canSave =
    !!nickname.trim() && isVerified && !isSaving && !isSending && !isConfirming;

  useEffect(() => {
    if (!open) return;

    setNickname(initial.nickname);
    setPhone(initial.phone);
    setCode(initial.code);

    setIsSending(false);
    setIsConfirming(false);
    setIsSaving(false);

    setCooldown(0);
    setIsVerified(false);
    setError(null);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => clearInterval(t);
  }, [open, cooldown]);

  const onSend = async () => {
    setError(null);
    if (!canSend || isSending) return;

    setIsSending(true);
    try {
      const res = await phoneVerificationApi.send({
        phoneNumber: phoneDigits,
        purpose: "SIGNUP",
        resend: true,
      });
      setCooldown(Math.max(res.cooldownSeconds ?? 0, 180));
    } catch (e: any) {
      setError(e?.message ?? "인증번호 발송에 실패했어요.");
    } finally {
      setIsSending(false);
    }
  };

  const onConfirm = async () => {
    setError(null);
    if (!canConfirm) return;

    setIsConfirming(true);
    try {
      const res = await phoneVerificationApi.confirm({
        phoneNumber: phoneDigits,
        verificationCode: code.trim(),
        purpose: "SIGNUP",
      });

      if (res.verified) setIsVerified(true);
      else setError("인증에 실패했어요.");
    } catch (e: any) {
      setError(e?.message ?? "인증번호 확인에 실패했어요.");
    } finally {
      setIsConfirming(false);
    }
  };

  const onSave = async () => {
    setError(null);
    if (!canSave) return;

    setIsSaving(true);
    try {
      await oauthSignup({
        nickname: nickname.trim(),
        phoneNumber: phoneDigits,
      });

      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "저장에 실패했어요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={() => {}}>
      <div className="w-full max-w-130 rounded-2xl border-2 border-outline bg-bg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="py-4 px-6 flex justify-between items-center border-b border-outline">
          <div className="space-y-1">
            <h4 className="text-lg">프로필 설정</h4>
            <p className="text-xs text-text-3">
              구글 로그인 후 닉네임과 전화번호 인증이 필요합니다.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm">닉네임</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3"
              placeholder="닉네임을 입력해주세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">전화번호</label>
            <div className="flex gap-2">
              <input
                value={formatPhone(phone)}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setIsVerified(false);
                  setCode("");
                }}
                className="flex-1 rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3"
                placeholder="‘-’ 없이 입력"
              />
              <Button
                type="button"
                onClick={onSend}
                disabled={!canSend || isSending || cooldown > 0}
                className="w-20"
              >
                {cooldown > 0 ? `${cooldown}s` : "인증"}
              </Button>
            </div>
            <p className="text-xs text-text-3">
              숫자 10-11자리 입력 시 발송됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm">인증번호</label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3"
                placeholder="인증번호를 입력해주세요"
                disabled={!canSend || cooldown === 0}
              />
              <Button
                type="button"
                onClick={onConfirm}
                disabled={!canConfirm}
                className="w-20"
              >
                확인
              </Button>
            </div>

            {isVerified ? (
              <p className="text-xs text-green-600">인증 완료</p>
            ) : null}
          </div>
        </div>

        <div className="py-6 px-6 border-t border-outline">
          <Button className="w-full py-3" onClick={onSave} disabled={!canSave}>
            {isSaving ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
