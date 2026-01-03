/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  accountRecoveryApi,
  ConfirmPhoneVerificationRequest,
  FindPasswordRequest,
  FindUserIdRequest,
  SendPhoneVerificationRequest,
} from "@/lib/api/auth/accountRecovery";
import FindIdResultModal from "./id/FindIdResultModal";
import ResetPasswordModal from "./password/ResetPasswordModal";
import FindPwIntroSection from "./password/FindPwIntroSection";
import PhoneVerificationSection from "./PhoneVerificationSection";
import FindIdSection from "./id/FindIdSection";

type Mode = "FIND_ID" | "FIND_PW";

// ✅ 핵심: 외부에서 mode를 주입 가능하게
export default function AccountRecoveryContent({
  initialMode = "FIND_ID",
  initialUserId,
  onDone,
}: {
  initialMode?: Mode;
  initialUserId?: string;
  onDone?: () => void; // 비번 변경 성공 등 완료 시 닫기용
}) {
  const router = useRouter();
  const searchParams = useSearchParams(); // 페이지에서 쓰던 로직 호환용(있어도 됨)

  const mode = useMemo<Mode>(() => {
    // 모달로 쓸 때는 URL 대신 initialMode 우선
    const m = searchParams.get("mode");
    if (m === "FIND_PW" || m === "FIND_ID") return m;
    return initialMode;
  }, [searchParams, initialMode]);

  const title = mode === "FIND_ID" ? "아이디 찾기" : "비밀번호 재설정";

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);

  const [foundUserId, setFoundUserId] = useState<string | null>(null);

  const [inputUserId, setInputUserId] = useState(initialUserId ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const normalizedPhone = useMemo(
    () => phoneNumber.replace(/\D/g, ""),
    [phoneNumber]
  );
  const phoneValid = normalizedPhone.length >= 10;
  const codeValid = verificationCode.trim().length >= 4;

  // phone 변경 시 초기화
  useEffect(() => {
    setVerified(false);
    setVerificationCode("");
    setFoundUserId(null);
    setHasSentCode(false);
    setCooldown(0);
  }, [normalizedPhone]);

  // mutations
  const sendCodeMutation = useMutation({
    mutationFn: (payload: SendPhoneVerificationRequest) =>
      accountRecoveryApi.sendVerificationCode(payload),
    onSuccess: () => {
      setHasSentCode(true);
      toast.success("인증번호를 발송했습니다.", {
        style: { borderColor: "#57b970" },
      });
    },
    onError: () => toast.error("인증번호 발송에 실패했습니다."),
  });

  const confirmCodeMutation = useMutation({
    mutationFn: (payload: ConfirmPhoneVerificationRequest) =>
      accountRecoveryApi.confirmVerificationCode(payload),
    onSuccess: (res) => {
      if (res.data.verified) {
        setVerified(true);
        toast.success("인증이 완료되었습니다.", {
          style: { borderColor: "#57b970" },
        });
      } else {
        setVerified(false);
        toast.error("인증번호가 올바르지 않습니다.");
      }
    },
    onError: () => {
      setVerified(false);
      toast.error("인증 확인에 실패했습니다.");
    },
  });

  const findIdMutation = useMutation({
    mutationFn: (payload: FindUserIdRequest) =>
      accountRecoveryApi.findUserId(payload),
    onSuccess: (res) => {
      const id = res.data.userId ?? null;
      setFoundUserId(id);

      if (!id) {
        toast.error("조회된 아이디가 없습니다.");
        return;
      }
      setIsResultOpen(true);
    },
    onError: () => toast.error("아이디 조회에 실패했습니다."),
  });

  const resetPwMutation = useMutation({
    mutationFn: (payload: FindPasswordRequest) =>
      accountRecoveryApi.findPassword(payload),
    onSuccess: () => {
      toast.success("비밀번호가 변경되었습니다.", {
        style: { borderColor: "#57b970" },
      });
      onDone?.(); // ✅ 완료시 부모가 닫을 수 있게
    },
    onError: () => toast.error("비밀번호 변경에 실패했습니다."),
  });

  // query: server userId by phone (PW)
  const serverUserIdQuery = useQuery({
    queryKey: ["accountRecovery", "serverUserIdByPhone", normalizedPhone],
    queryFn: ({ signal }) =>
      accountRecoveryApi.findUserId({ phoneNum: normalizedPhone }, signal),
    enabled: mode === "FIND_PW" && verified && phoneValid,
    staleTime: 60_000,
  });

  const serverUserId = serverUserIdQuery.data?.data.userId ?? null;

  const idMatched =
    mode === "FIND_PW" &&
    !!serverUserId &&
    inputUserId.trim().length > 0 &&
    inputUserId.trim() === serverUserId;

  useEffect(() => {
    if (mode !== "FIND_PW") return;

    if (verified && idMatched) setIsPwModalOpen(true);

    if (!verified || !idMatched) {
      setIsPwModalOpen(false);
      setNewPassword("");
      setNewPassword2("");
    }
  }, [mode, verified, idMatched]);

  // guards
  const canSend =
    phoneValid &&
    !sendCodeMutation.isPending &&
    (mode === "FIND_ID" || inputUserId.trim().length > 0);

  const canConfirm = phoneValid && codeValid && !confirmCodeMutation.isPending;

  const canFindId = verified && !findIdMutation.isPending;

  const canResetPw =
    verified &&
    idMatched &&
    newPassword.length >= 8 &&
    newPassword === newPassword2 &&
    !resetPwMutation.isPending;

  const handleSendCode = () => {
    sendCodeMutation.mutate({
      phoneNumber: normalizedPhone,
      purpose: mode,
      resend: hasSentCode,
    });
    setCooldown(60 * 3);
  };

  const handleConfirmCode = () => {
    confirmCodeMutation.mutate({
      phoneNumber: normalizedPhone,
      verificationCode: verificationCode.trim(),
      purpose: mode,
    });
  };

  return (
    <div className="w-full max-w-xl bg-white/80 p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-text-3 text-sm">
          전화번호 인증이 완료된 경우에만 아이디 조회/비밀번호 변경이
          가능합니다.
        </p>
      </div>

      <FindIdResultModal
        open={mode === "FIND_ID" && isResultOpen}
        foundUserId={foundUserId}
        onClose={() => setIsResultOpen(false)}
        onGoLogin={() => router.push("/auth/login")}
        onGoFindPw={(userId) => {
          // 모달 안에서는 라우팅 대신 inputUserId 채워서 흐름 이어가고 싶으면 여기 바꿔도 됨
          router.push(
            `/auth/account-recovery?mode=FIND_PW&userId=${encodeURIComponent(
              userId
            )}`
          );
        }}
      />

      <ResetPasswordModal
        open={mode === "FIND_PW" && isPwModalOpen}
        onClose={() => setIsPwModalOpen(false)}
        newPassword={newPassword}
        newPassword2={newPassword2}
        setNewPassword={setNewPassword}
        setNewPassword2={setNewPassword2}
        canReset={canResetPw}
        isPending={resetPwMutation.isPending}
        isSuccess={resetPwMutation.isSuccess}
        onSubmit={() =>
          resetPwMutation.mutate({
            phoneNum: normalizedPhone,
            password: newPassword,
          })
        }
        onGoLogin={() => router.push("/auth/login")}
      />

      {mode === "FIND_PW" && (
        <FindPwIntroSection
          inputUserId={inputUserId}
          setInputUserId={setInputUserId}
        />
      )}

      <PhoneVerificationSection
        mode={mode}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        verified={verified}
        cooldown={cooldown}
        canSend={canSend}
        canConfirm={canConfirm}
        onSendCode={handleSendCode}
        onConfirmCode={handleConfirmCode}
        confirmPending={confirmCodeMutation.isPending}
      />

      {mode === "FIND_ID" && (
        <FindIdSection
          verified={verified}
          canFindId={canFindId}
          pending={findIdMutation.isPending}
          onFindId={() => findIdMutation.mutate({ phoneNum: normalizedPhone })}
        />
      )}
    </div>
  );
}
