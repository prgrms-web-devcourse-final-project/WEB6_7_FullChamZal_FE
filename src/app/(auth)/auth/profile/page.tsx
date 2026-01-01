"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { phoneVerificationApi } from "@/lib/api/phoneVerification";
import { oauthSignup } from "@/lib/api/oauth";
import { getMeDetail } from "@/lib/api/members/members";
import toast from "react-hot-toast";

const digitsOnly = (v: string) => v.replace(/\D/g, "");
const isValidKoreanPhoneDigits = (digits: string) =>
  digits.length === 10 || digits.length === 11;

export default function AuthProfilePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const phoneDigits = useMemo(() => digitsOnly(phone), [phone]);

  const [code, setCode] = useState("");

  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이미 닉네임/전화번호가 있으면 굳이 여기 있을 필요 없음
  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        const me = await getMeDetail();
        const needNickname = !me.nickname || !me.nickname.trim();
        const needPhone = !me.phoneNumber || !me.phoneNumber.trim();

        if (!alive) return;
        if (!needNickname && !needPhone) {
          router.replace("/dashboard");
        } else {
          if (needNickname === false) setNickname(me.nickname ?? "");
          if (needPhone === false) setPhone(me.phoneNumber ?? "");
        }
      } catch {
        // 비로그인이라면 auth 쪽 정책대로 처리
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [router]);

  // cooldown tick
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // 전화번호가 바뀌면 인증상태 리셋
  useEffect(() => {
    setIsVerified(false);
    setCode("");
  }, [phoneDigits]);

  const canSend =
    isValidKoreanPhoneDigits(phoneDigits) && !isSending && cooldown === 0;

  const canConfirm =
    code.trim().length > 0 &&
    isValidKoreanPhoneDigits(phoneDigits) &&
    !isConfirming &&
    !isVerified;

  const canSave =
    nickname.trim().length > 0 &&
    isValidKoreanPhoneDigits(phoneDigits) &&
    isVerified &&
    !isSaving;

  const onSend = async () => {
    setError(null);

    if (!isValidKoreanPhoneDigits(phoneDigits)) {
      setError("전화번호 형식이 올바르지 않아요.");
      return;
    }

    setIsSending(true);
    try {
      const res = await phoneVerificationApi.send({
        phoneNumber: phoneDigits,
        purpose: "SIGNUP",
        resend: true,
      });
      setCooldown(res.cooldownSeconds ?? 180);
      toast.success("인증번호 발송을 성공했습니다!", {
        style: { borderColor: "#57b970" },
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "인증번호 발송에 실패했어요.";
      setError(message);
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

      if (res.verified) {
        setIsVerified(true);
        toast.success("인증번호 확인을 성공했습니다!", {
          style: { borderColor: "#57b970" },
        });
      } else {
        setError("인증에 실패했어요.");
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "인증번호 확인에 실패했어요.";
      setError(message);
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

      toast.success("저장을 성공했습니다!", {
        style: { borderColor: "#57b970" },
      });
      router.replace("/dashboard");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "저장에 실패했어요.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sub px-4">
      <div className="w-full max-w-130 rounded-2xl border border-outline bg-white p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">프로필 설정</h1>
          <p className="text-sm text-text-3">
            구글 로그인 후, 닉네임과 전화번호 인증을 완료해주세요.
          </p>
        </div>

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
            className="w-full py-3 px-4 border border-outline rounded-xl outline-none focus:ring-2 focus:ring-primary-3"
            placeholder="닉네임을 입력해주세요"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">전화번호</label>
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 py-3 px-4 border border-outline rounded-xl outline-none focus:ring-2 focus:ring-primary-3"
              placeholder="'-' 없이 입력"
            />
            <Button
              type="button"
              onClick={onSend}
              disabled={!canSend}
              className="w-24"
            >
              {cooldown > 0 ? `${cooldown}s` : isSending ? "전송" : "인증"}
            </Button>
          </div>
          <p className="text-xs text-text-3">
            숫자만 10~11자리 형식만 통과시키고, 그 외는 전송 버튼을 막습니다.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm">인증번호</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 py-3 px-4 border border-outline rounded-xl outline-none focus:ring-2 focus:ring-primary-3"
              placeholder="인증번호를 입력해주세요"
              disabled={isVerified}
            />
            <Button
              type="button"
              onClick={onConfirm}
              disabled={!canConfirm}
              className="w-28"
            >
              {isVerified ? "완료" : isConfirming ? "확인" : "확인"}
            </Button>
          </div>
        </div>

        <Button className="w-full py-3" onClick={onSave} disabled={!canSave}>
          {isSaving ? "저장 중..." : "저장하기"}
        </Button>

        <button
          type="button"
          className="w-full text-center text-xs text-text-3 underline"
          onClick={() => router.replace("/dashboard")}
        >
          나중에 할래요
        </button>
      </div>
    </div>
  );
}
