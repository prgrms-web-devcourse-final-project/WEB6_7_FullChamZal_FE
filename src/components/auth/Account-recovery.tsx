"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/common/Button";
import {
  accountRecoveryApi,
  ConfirmPhoneVerificationRequest,
  FindPasswordRequest,
  FindUserIdRequest,
  SendPhoneVerificationRequest,
} from "@/lib/api/auth/accountRecovery";

type Mode = "FIND_ID" | "FIND_PW";

export default function AccountRecoveryPage() {
  const searchParams = useSearchParams();

  const mode = useMemo<Mode>(() => {
    const m = searchParams.get("mode");
    return m === "FIND_PW" ? "FIND_PW" : "FIND_ID";
  }, [searchParams]);

  const title = mode === "FIND_ID" ? "아이디 찾기" : "비밀번호 재설정";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verified, setVerified] = useState(false);

  // 아이디 찾기 결과
  const [foundUserId, setFoundUserId] = useState<string | null>(null);

  // 비밀번호 재설정: 사용자가 입력한 아이디
  const [inputUserId, setInputUserId] = useState("");

  // 비밀번호 재설정: 서버에서 전화번호로 조회된 아이디
  const [serverUserId, setServerUserId] = useState<string | null>(null);
  const [serverIdLoading, setServerIdLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");


  const sendCodeMutation = useMutation({
    mutationFn: (payload: SendPhoneVerificationRequest) =>
      accountRecoveryApi.sendVerificationCode(payload),
  });

  const confirmCodeMutation = useMutation({
    mutationFn: (payload: ConfirmPhoneVerificationRequest) =>
      accountRecoveryApi.confirmVerificationCode(payload),
    onSuccess: (res) => {
  
      if (res.data.verified) setVerified(true);
    },
  });

  const findIdMutation = useMutation({
    mutationFn: (payload: FindUserIdRequest) => accountRecoveryApi.findUserId(payload),
    onSuccess: (res) => {
  
      setFoundUserId(res.data.userId ?? null);
    },
  });

  const resetPwMutation = useMutation({
    mutationFn: (payload: FindPasswordRequest) => accountRecoveryApi.findPassword(payload),
  });


  useEffect(() => {
    if (mode !== "FIND_PW") return;
    if (!verified) return;
    if (!phoneNumber.trim()) return;

    let cancelled = false;

    (async () => {
      try {
        setServerIdLoading(true);
        const res = await accountRecoveryApi.findUserId({ phoneNum: phoneNumber });

        if (cancelled) return;
        setServerUserId(res.data.userId ?? null);
      } finally {
        if (!cancelled) setServerIdLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, verified, phoneNumber]);


  useEffect(() => {
    setVerified(false);
    setVerificationCode("");
    setFoundUserId(null);
    setServerUserId(null);
    setInputUserId("");
    setNewPassword("");
    setNewPassword2("");
    setServerIdLoading(false);
  }, [mode]);

  
  const canSend =
    phoneNumber.trim().length >= 10 &&
    !sendCodeMutation.isPending &&
    (mode === "FIND_ID" || inputUserId.trim().length > 0); // PW 모드면 아이디 입력해야 발송

  const canConfirm =
    phoneNumber.trim().length >= 10 &&
    verificationCode.trim().length >= 4 &&
    !confirmCodeMutation.isPending;

  const canFindId = verified && !findIdMutation.isPending;

  const idMatched =
    mode === "FIND_PW" &&
    !!serverUserId &&
    inputUserId.trim().length > 0 &&
    inputUserId.trim() === serverUserId;

  const canResetPw =
    verified &&
    idMatched &&
    newPassword.length >= 8 &&
    newPassword === newPassword2 &&
    !resetPwMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl border border-outline rounded-2xl bg-white/80 p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-text-3 text-sm">
            전화번호 인증이 완료된 경우에만 아이디 조회/비밀번호 변경이 가능합니다.
          </p>
        </div>

        {/* 비밀번호 재설정일 때만 아이디 입력 */}
        {mode === "FIND_PW" && (
          <div className="space-y-2">
            <label className="text-sm text-text-2">아이디</label>
            <input
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
            />
            <p className="text-xs text-text-3">
              입력한 아이디와, 인증된 전화번호로 조회된 아이디가 일치할 때만 비밀번호 변경이 가능합니다.
            </p>
          </div>
        )}

        {/* 1) 전화번호 */}
        <div className="space-y-2">
          <label className="text-sm text-text-2">전화번호</label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="01012345678"
            className="w-full p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
          />

          <div className="flex gap-2">
            <Button
              className="w-full py-3"
              onClick={() =>
                sendCodeMutation.mutate({
                  phoneNumber,
                  purpose: mode,
                  resend: false,
                })
              }
              disabled={!canSend}
            >
              인증번호 발송
            </Button>
            <Button
              className="w-full py-3"
              onClick={() =>
                sendCodeMutation.mutate({
                  phoneNumber,
                  purpose: mode,
                  resend: true,
                })
              }
              disabled={!canSend}
            >
              재발송
            </Button>
          </div>
        </div>

        {/* 2) 인증번호 */}
        <div className="space-y-2">
          <label className="text-sm text-text-2">인증번호</label>
          <div className="flex gap-2">
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              className="flex-1 p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
            />
            <Button
              className="px-6 py-3"
              onClick={() =>
                confirmCodeMutation.mutate({
                  phoneNumber,
                  verificationCode,
                  purpose: mode,
                })
              }
              disabled={!canConfirm}
            >
              인증 확인
            </Button>
          </div>

          {verified && (
            <div className="text-sm text-text-3">인증 완료. 다음 단계를 진행하세요.</div>
          )}
        </div>

        {/* 3) 아이디 찾기 */}
        {mode === "FIND_ID" && (
          <div className="space-y-3 border-t border-outline pt-6">
            <Button
              className="w-full py-3"
              onClick={() => findIdMutation.mutate({ phoneNum: phoneNumber })}
              disabled={!canFindId}
            >
              내 아이디 조회
            </Button>

            {foundUserId && (
              <div className="rounded-xl border border-outline bg-white p-4">
                <p className="text-sm text-text-2">조회된 아이디</p>
                {/* ✅ 마스킹 제거: 그대로 보여줌 */}
                <p className="text-lg font-semibold">{foundUserId}</p>
              </div>
            )}
          </div>
        )}

        {/* 4) 비밀번호 재설정 */}
        {mode === "FIND_PW" && (
          <div className="space-y-3 border-t border-outline pt-6">
            {!verified && (
              <div className="text-sm text-text-3">먼저 전화번호 인증을 완료해주세요.</div>
            )}

            {verified && (
              <div className="rounded-xl border border-outline bg-white p-4 space-y-2">
                <p className="text-sm text-text-2">이 전화번호로 조회된 아이디</p>

                {serverIdLoading ? (
                  <p className="text-sm text-text-3">아이디 확인 중...</p>
                ) : (
                  <p className="text-lg font-semibold">{serverUserId ?? "-"}</p>
                )}

                {serverUserId && !idMatched && (
                  <p className="text-sm text-primary">
                    입력한 아이디와 조회된 아이디가 일치하지 않습니다.
                  </p>
                )}
              </div>
            )}

            {verified && idMatched && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-text-2">새 비밀번호</label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="8자 이상"
                    className="w-full p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-text-2">새 비밀번호 확인</label>
                  <input
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    type="password"
                    placeholder="비밀번호 재입력"
                    className="w-full p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
                  />
                  {newPassword2.length > 0 && newPassword !== newPassword2 && (
                    <p className="text-sm text-primary">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>

                <Button
                  className="w-full py-3"
                  onClick={() =>
                    resetPwMutation.mutate({
                      phoneNum: phoneNumber,
                      password: newPassword,
                    })
                  }
                  disabled={!canResetPw}
                >
                  비밀번호 변경
                </Button>

                {resetPwMutation.isSuccess && (
                  <div className="text-sm text-text-3">
                    비밀번호 변경 완료. 로그인 페이지로 돌아가서 로그인하세요.
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
