"use client";
import Input from "@/components/common/Input";
import Logo from "@/components/common/Logo";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const [showAuthInput, setShowAuthInput] = useState(false);

  const [id, setId] = useState("");
  const [idTouched, setIdTouched] = useState(false);

  const [pw, setPw] = useState("");
  const [pwTouched, setPwTouched] = useState(false);

  const [pwCheck, setPwCheck] = useState("");
  const [pwCheckTouched, setPwCheckTouched] = useState(false);

  const [tel, setTel] = useState("");
  const [telTouched, setTelTouched] = useState(false);

  const [authCode, setAuthCode] = useState("");

  // 인증 버튼 관련 상태
  const [hasSentOnce, setHasSentOnce] = useState(false); // 한 번이라도 전송했는지
  const [countdown, setCountdown] = useState(0); // 60초 카운트다운

  // 정규식: 010-XXXX-XXXX
  const phoneRegex = /^010\d{8}$/;
  const isPhoneValid = phoneRegex.test(tel.trim());

  const handleSendAuthCode = () => {
    // 전화번호 칸을 건드린 상태로 표시
    setTelTouched(true);

    // 유효하지 않으면 전송 X
    if (!isPhoneValid) return;

    // 여기서 실제 인증번호 요청 API 호출
    // await fetch("/api/v1/phone-verifications/0", { ... })

    setShowAuthInput(true);
    setHasSentOnce(true);
    setCountdown(60); // 60초 타이머 시작
  };

  const handleVerifyAuthCode = () => {
    if (!authCode.trim()) return;

    // 여기서 실제 인증번호 검증 API 호출
    // ex) await fetch("/api/v1/phone-verifications/1", { ... })

    // 필요하면 인증 완료 상태를 따로 들고 성공 메시지도 보여줄 수 있음
    alert("인증이 완료되었습니다. (지금은 데모 동작)");
  };

  // 60초 카운트다운 타이머
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // 에러 메시지들
  const idError =
    idTouched && id.length < 5 ? "아이디는 5글자 이상이어야 합니다." : "";

  const pwError =
    pwTouched && pw.length < 8 ? "비밀번호는 8자 이상이어야 합니다." : "";

  const pwCheckError =
    pwCheckTouched && pw !== pwCheck ? "비밀번호가 일치하지 않습니다." : "";

  const telError = telTouched && !isPhoneValid ? "전화번호를 입력하세요." : "";

  // 인증 버튼 라벨
  const sendButtonLabel =
    countdown > 0
      ? `${hasSentOnce ? "재전송" : "인증"} (${countdown}s)`
      : hasSentOnce
      ? "재전송"
      : "인증";

  // 인증 버튼 disabled 조건: 전화번호 형식이 유효하지 않거나, 타이머 동작 중일 때
  const isSendDisabled = !isPhoneValid || countdown > 0;

  // 인증번호 확인 버튼 disabled
  const isVerifyDisabled = !authCode.trim();

  return (
    <section className="min-w-lg min-h-180 py-20">
      <button className="cursor-pointer flex items-center gap-1 text-text-3 ml-4 mb-4 hover:text-text ">
        <ArrowLeft size={18} />
        <span className="text-sm">홈으로</span>
      </button>

      <div className="w-full p-10 rounded-3xl bg-sub border border-outline space-y-8 shadow-xl">
        {/* 로고 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Logo className="w-9" />
            <span className="text-primary text-2xl font-paperozi font-extrabold">
              Dear. ___
            </span>
          </div>
          <div className="space-y-3 text-center">
            <p className="text-3xl font-semibold">회원가입</p>
            <p>Dear. ___ 과 함께 특별한 여정을 시작하세요.</p>
          </div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <button
          type="button"
          className="cursor-pointer w-full py-3 bg-white/80 rounded-xl flex items-center justify-center gap-2 border border-outline"
        >
          <span>Google</span>
        </button>

        {/* 구분선 */}
        <div className="py-4">
          <div className="w-full h-px bg-text-5"></div>
        </div>

        {/* 입력 폼 */}
        <form className="space-y-6">
          <div className="space-y-5">
            <Input id="name" label="이름" placeholder="홍길동" />

            <Input
              id="id"
              label="아이디"
              placeholder="your123"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onBlur={() => setIdTouched(true)}
              error={idError}
            />

            <Input
              id="pw"
              label="비밀번호"
              type="password"
              placeholder="********"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onBlur={() => setPwTouched(true)}
              error={pwError}
            />

            <Input
              id="pwCheck"
              label="비밀번호 확인"
              type="password"
              placeholder="********"
              value={pwCheck}
              onChange={(e) => setPwCheck(e.target.value)}
              onBlur={() => setPwCheckTouched(true)}
              error={pwCheckError}
            />

            {/* 전화번호 + 인증 버튼 */}
            <Input
              id="tel"
              label="전화번호"
              placeholder="'-' 없이 입력"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              onBlur={() => setTelTouched(true)}
              error={telError}
            >
              <button
                type="button"
                onClick={handleSendAuthCode}
                disabled={isSendDisabled}
                className={`
                  inline-flex items-center justify-center w-20 h-13 rounded-xl text-white
                  ${
                    isSendDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-3 hover:bg-primary-2 cursor-pointer"
                  }
                `}
              >
                {sendButtonLabel}
              </button>
            </Input>

            {/* 인증번호 입력창: 버튼 누른 뒤에만 보이게 */}
            {showAuthInput && (
              <Input
                id="authCode"
                label="인증번호"
                placeholder="XXXXXX"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              >
                <button
                  type="button"
                  onClick={handleVerifyAuthCode}
                  disabled={isVerifyDisabled}
                  className={`
                    inline-flex items-center justify-center w-20 h-13 rounded-xl text-white
                    ${
                      isVerifyDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-3 hover:bg-primary-2 cursor-pointer"
                    }
                  `}
                >
                  확인
                </button>
              </Input>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-primary-3 hover:bg-primary-2"
          >
            회원가입
          </button>
        </form>
      </div>
    </section>
  );
}
