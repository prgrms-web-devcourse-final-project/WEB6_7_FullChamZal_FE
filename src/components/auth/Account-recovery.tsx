"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/common/Button";
import { accountRecoveryApi } from "@/lib/api/auth/accountRecovery";

type Mode = "FIND_ID" | "FIND_PW";

function maskUserId(userId: string) {
  if (userId.length <= 2) return "*".repeat(userId.length);
  const head = userId.slice(0, 2);
  const tail = userId.slice(-1);
  return `${head}${"*".repeat(Math.max(1, userId.length - 3))}${tail}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function pickString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}
function extractUserIdFromResponse(res: unknown): string | null {
  if (!isRecord(res)) return null;
  const data = res["data"];
  if (!isRecord(data)) return null;

  const direct = pickString(data, "userId") ?? pickString(data, "loginId");
  if (direct) return direct;

  const nested = data["data"];
  if (!isRecord(nested)) return null;

  return pickString(nested, "userId") ?? pickString(nested, "loginId");
}

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

  
  const [foundUserId, setFoundUserId] = useState<string | null>(null);

  
  const [inputUserId, setInputUserId] = useState("");

  
  const [serverUserId, setServerUserId] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const sendCodeMutation = useMutation({
    mutationFn: async (payload: {
      phoneNumber: string;
      purpose: "FIND_ID" | "FIND_PW";
      resend: boolean;
    }) => accountRecoveryApi.sendVerificationCode(payload),
  });

  const confirmCodeMutation = useMutation({
  mutationFn: (payload: {
    phoneNumber: string;
    verificationCode: string;
    purpose: "FIND_ID" | "FIND_PW";
  }) => accountRecoveryApi.confirmVerificationCode(payload),
  onSuccess: (res) => {
  
    if (res.data.verified) setVerified(true);
  },
});

const findIdMutation = useMutation({
  mutationFn: (payload: { phoneNum: string }) => accountRecoveryApi.findUserId(payload),
  onSuccess: (res) => {
   
    const userId = res.data.userId; 
    setFoundUserId(userId || null);
  },
});


  const resetPwMutation = useMutation({
    mutationFn: async (payload: { phoneNum: string; password: string }) =>
      accountRecoveryApi.findPassword(payload),
  });

  
  useEffect(() => {
    if (mode !== "FIND_PW") return;
    if (!verified) return;
    if (!phoneNumber.trim()) return;

    
    findIdMutation.mutate(
      { phoneNum: phoneNumber },
      {
        onSuccess: (res) => {
          const uid = extractUserIdFromResponse(res);
          setServerUserId(uid);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, verified]);

  const canSend =
    phoneNumber.trim().length >= 10 &&
    !sendCodeMutation.isPending &&
    (mode === "FIND_ID" || inputUserId.trim().length > 0); 

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

  const displayedFoundId = useMemo(() => {
    if (!foundUserId) return null;
    return foundUserId.includes("*") ? foundUserId : maskUserId(foundUserId);
  }, [foundUserId]);

  const displayedServerId = useMemo(() => {
    if (!serverUserId) return null;
    return serverUserId.includes("*") ? serverUserId : maskUserId(serverUserId);
  }, [serverUserId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl border border-outline rounded-2xl bg-white/80 p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-text-3 text-sm">
            전화번호 인증이 완료된 경우에만 아이디 조회/비밀번호 변경이 가능합니다.
          </p>
        </div>

       
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

            {displayedFoundId && (
              <div className="rounded-xl border border-outline bg-white p-4">
                <p className="text-sm text-text-2">조회된 아이디</p>
                <p className="text-lg font-semibold">{displayedFoundId}</p>
              </div>
            )}
          </div>
        )}

        {/* 4) 비밀번호 재설정 */}
        {mode === "FIND_PW" && (
          <div className="space-y-3 border-t border-outline pt-6">
           
            {verified && (
              <div className="rounded-xl border border-outline bg-white p-4 space-y-2">
                <p className="text-sm text-text-2">이 전화번호로 조회된 아이디</p>
                <p className="text-lg font-semibold">{displayedServerId ?? "-"}</p>

                {!serverUserId && (
                  <p className="text-xs text-text-3">아이디 확인 중...</p>
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

           
            {!verified && (
              <div className="text-sm text-text-3">먼저 전화번호 인증을 완료해주세요.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
