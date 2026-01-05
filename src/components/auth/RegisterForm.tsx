"use client";

import Button from "../common/tag/Button";
import Input from "../common/tag/Input";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { phoneVerificationApi } from "@/lib/api/phoneVerification";
import { ApiError } from "@/lib/api/fetchClient";
import { authApiClient } from "@/lib/api/auth/auth.client";
import ActiveModal from "../common/modal/ActiveModal";

export default function RegisterForm({
  agreements,
  onBack,
}: {
  agreements: { terms: boolean; privacy: boolean; marketing: boolean };
  onBack?: () => void;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnUrl = useMemo(() => {
    const cb = searchParams.get("returnUrl") || searchParams.get("callback");
    return cb && cb.startsWith("/") ? cb : null;
  }, [searchParams]);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);

  const [id, setId] = useState("");
  const [idTouched, setIdTouched] = useState(false);

  const [pw, setPw] = useState("");
  const [pwTouched, setPwTouched] = useState(false);

  const [pwCheck, setPwCheck] = useState("");
  const [pwCheckTouched, setPwCheckTouched] = useState(false);

  const [tel, setTel] = useState("");
  const [telTouched, setTelTouched] = useState(false);

  const [authCode, setAuthCode] = useState("");

  const [showAuthInput, setShowAuthInput] = useState(false);
  const [hasSentOnce, setHasSentOnce] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState<string | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [isVerifySuccessModalOpen, setIsVerifySuccessModalOpen] =
    useState(false);
  const [isVerifyFailModalOpen, setIsVerifyFailModalOpen] = useState(false);
  const [isSignupSuccessModalOpen, setIsSignupSuccessModalOpen] =
    useState(false);
  const [isSignupFailModalOpen, setIsSignupFailModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const normalizedPhone = useMemo(() => tel.replace(/\D/g, ""), [tel]);
  const isPhoneValid = /^010\d{8}$/.test(normalizedPhone);

  const idRegex = /^[a-zA-Z0-9_]{4,20}$/;
  const pwRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  useEffect(() => {
    if (verifiedPhoneNumber && normalizedPhone !== verifiedPhoneNumber) {
      setIsPhoneVerified(false);
    }
  }, [normalizedPhone, verifiedPhoneNumber]);

  const nameError = nameTouched && !name.trim() ? "이름을 입력하세요." : "";
  const nicknameError =
    nicknameTouched && !nickname.trim() ? "닉네임을 입력하세요." : "";

  const idError =
    idTouched && !idRegex.test(id.trim()) ? "아이디는 4~20자여야 합니다." : "";
  const pwError =
    pwTouched && !pwRegex.test(pw)
      ? "비밀번호는 영문, 숫자, 특수문자를 포함해서 8자리 이상이어야 합니다."
      : "";
  const pwCheckError =
    pwCheckTouched && pw !== pwCheck ? "비밀번호가 일치하지 않습니다." : "";
  const telError = telTouched && !isPhoneValid ? "전화번호를 입력하세요." : "";

  const isSendDisabled = !isPhoneValid || countdown > 0;
  const isVerifyDisabled = !authCode.trim() || !isPhoneValid;

  const handleSendAuthCode = async () => {
    setTelTouched(true);
    setSubmitError("");

    if (!isPhoneValid) return;

    try {
      const data = await phoneVerificationApi.send({
        phoneNumber: normalizedPhone,
        purpose: "SIGNUP",
        resend: hasSentOnce,
      });

      setShowAuthInput(true);
      setHasSentOnce(true);
      setCountdown(data.cooldownSeconds ?? 180);

      setIsPhoneVerified(false);
      setVerifiedPhoneNumber(null);
    } catch (e) {
      const err = e as unknown;
      const msg =
        err instanceof ApiError ? err.message : "인증번호 요청에 실패했습니다.";
      setSubmitError(msg);
      setModalMessage(msg);
      setIsVerifyFailModalOpen(true);
    }
  };

  const handleVerifyAuthCode = async () => {
    setSubmitError("");

    if (!authCode.trim()) return;
    if (!isPhoneValid) return;

    try {
      const data = await phoneVerificationApi.confirm({
        phoneNumber: normalizedPhone,
        verificationCode: authCode.trim(),
        purpose: "SIGNUP",
      });

      if (data.verified) {
        setIsPhoneVerified(true);
        setVerifiedPhoneNumber(normalizedPhone);

        setModalMessage("인증이 완료되었습니다.");
        setIsVerifySuccessModalOpen(true);
      } else {
        setIsPhoneVerified(false);
        setVerifiedPhoneNumber(null);

        setModalMessage("인증에 실패했습니다.");
        setIsVerifyFailModalOpen(true);
      }
    } catch (e) {
      const err = e as unknown;
      const msg =
        err instanceof ApiError ? err.message : "인증번호 확인에 실패했습니다.";
      setSubmitError(msg);
      setModalMessage(msg);
      setIsVerifyFailModalOpen(true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // 약관 체크(필요한 것만)
    if (!agreements.terms || !agreements.privacy) {
      const msg = "필수 약관에 동의해주세요.";
      setSubmitError(msg);
      setModalMessage(msg);
      setIsSignupFailModalOpen(true);
      return;
    }

    setNameTouched(true);
    setNicknameTouched(true);
    setIdTouched(true);
    setPwTouched(true);
    setPwCheckTouched(true);
    setTelTouched(true);

    if (
      nameError ||
      nicknameError ||
      idError ||
      pwError ||
      pwCheckError ||
      telError
    )
      return;

    if (!isPhoneVerified) {
      const msg = "전화번호 인증을 완료해주세요.";
      setSubmitError(msg);
      setModalMessage(msg);
      setIsSignupFailModalOpen(true);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await authApiClient.signup({
        userId: id.trim(),
        password: pw,
        name: name.trim(),
        nickname: nickname.trim(),
        phoneNumber: normalizedPhone,
      });

      await authApiClient.login({ userId: id.trim(), password: pw });

      const me = await authApiClient.me();
      const fallbackTarget = me.role === "ADMIN" ? "/admin" : "/dashboard";
      const target = returnUrl ?? fallbackTarget;

      setRedirectTarget(target);
      setModalMessage("회원가입이 완료되었습니다.");
      setIsSignupSuccessModalOpen(true);
    } catch (e) {
      const err = e as unknown;
      const msg =
        err instanceof ApiError ? err.message : "회원가입에 실패했습니다.";
      setSubmitError(msg);
      setModalMessage(msg);
      setIsSignupFailModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRouter = () => {
    if (!redirectTarget) return;
    router.replace(redirectTarget);
    router.refresh();
  };

  return (
    <>
      {/* 모달 placeholder */}
      {isVerifySuccessModalOpen && (
        <ActiveModal
          active={"success"}
          title={"인증 완료"}
          content={"성공적으로 인증이 완료되었습니다."}
          open={isVerifySuccessModalOpen}
          onClose={() => setIsVerifySuccessModalOpen(false)}
        />
      )}
      {isVerifyFailModalOpen && (
        <ActiveModal
          active={"fail"}
          title={"인증 실패"}
          content={"인증이 실패했습니다."}
          open={isVerifyFailModalOpen}
          onClose={() => setIsVerifyFailModalOpen(false)}
        />
      )}
      {isSignupSuccessModalOpen && (
        <ActiveModal
          active={"success"}
          title={"회원가입 완료"}
          content={"성공적으로 회원가입이 완료되었습니다."}
          open={isSignupSuccessModalOpen}
          onClose={() => setIsSignupSuccessModalOpen(false)}
          onConfirm={() => handleRouter()}
        />
      )}
      {isSignupFailModalOpen && (
        <ActiveModal
          active={"fail"}
          title={"회원가입 실패"}
          content={`${modalMessage} 회원가입에 실패했습니다.`}
          open={isSignupFailModalOpen}
          onClose={() => setIsSignupFailModalOpen(false)}
        />
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <Input
            id="name"
            label="이름"
            placeholder="성함"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            error={nameError}
          />

          <Input
            id="nickname"
            label="닉네임"
            placeholder="별명 또는 닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => setNicknameTouched(true)}
            error={nicknameError}
          />

          <Input
            id="id"
            label="아이디"
            placeholder="영문·숫자 조합 (4~20자)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onBlur={() => setIdTouched(true)}
            error={idError}
          />

          <Input
            id="pw"
            label="비밀번호"
            type="password"
            placeholder="영문·숫자·특수문자 포함 (8자 이상)"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onBlur={() => setPwTouched(true)}
            error={pwError}
          />

          <Input
            id="pwCheck"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호 재입력"
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
            onBlur={() => setPwCheckTouched(true)}
            error={pwCheckError}
          />

          <Input
            id="tel"
            label="전화번호"
            placeholder="'-' 없이 입력"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            onBlur={() => setTelTouched(true)}
            error={telError}
          >
            <Button
              type="button"
              onClick={handleSendAuthCode}
              disabled={isSendDisabled}
              className={"flex flex-col w-15 md:w-19"}
            >
              {countdown > 0 ? (
                <>
                  재전송{" "}
                  <span className="text-xs font-normal">({countdown}s)</span>
                </>
              ) : hasSentOnce ? (
                "재전송"
              ) : (
                "인증"
              )}
            </Button>
          </Input>

          {showAuthInput && (
            <Input
              id="authCode"
              label="인증번호"
              placeholder="XXXXXX"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            >
              <Button
                type="button"
                onClick={handleVerifyAuthCode}
                disabled={isVerifyDisabled}
                className={"w-15 md:w-19"}
              >
                확인
              </Button>
            </Input>
          )}

          {submitError ? (
            <p className="text-error text-sm">{submitError}</p>
          ) : null}
          {isPhoneVerified ? (
            <p className="text-green-600 text-sm">인증 완료</p>
          ) : null}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="w-full py-3 border border-outline bg-bg text-text md:font-normal hover:bg-button-hover"
          >
            뒤로 가기
          </Button>

          <Button
            type="submit"
            className="w-full py-3"
            disabled={
              isSubmitting ||
              !!(
                nameError ||
                nicknameError ||
                idError ||
                pwError ||
                pwCheckError ||
                telError
              ) ||
              !isPhoneVerified
            }
          >
            회원가입
          </Button>
        </div>
      </form>
    </>
  );
}
