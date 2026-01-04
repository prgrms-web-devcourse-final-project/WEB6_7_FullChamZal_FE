"use client";

import { Suspense, useState } from "react";
import AgreeRegister from "@/components/auth/AgreeRegister";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const [step, setStep] = useState<"agree" | "form">("agree");
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const canGoNext = agreements.terms && agreements.privacy;

  return (
    <Suspense fallback={<div className="p-8">로딩 중...</div>}>
      <AuthShell
        title="회원가입"
        description="Dear. ___ 과 함께 특별한 여정을 시작하세요."
        showSocial={step === "form"}
      >
        {step === "agree" ? (
          <AgreeRegister
            value={agreements}
            onChange={setAgreements}
            onNext={() => {
              if (!canGoNext) return;
              setStep("form");
            }}
          />
        ) : (
          <RegisterForm
            agreements={agreements}
            onBack={() => setStep("agree")}
          />
        )}
      </AuthShell>
    </Suspense>
  );
}
