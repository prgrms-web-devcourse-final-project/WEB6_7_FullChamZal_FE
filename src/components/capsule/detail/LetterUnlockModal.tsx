"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Logo from "@/components/common/Logo";

export default function LetterUnlockModal({
  onVerify,
  onSuccess,
}: {
  onVerify: (password: string) => Promise<boolean>;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const ok = await onVerify(password);
      if (!ok) {
        setError("비밀번호가 올바르지 않아요.");
        return;
      }
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-120 rounded-3xl border border-outline bg-white shadow-xl p-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-primary">
          <Logo className="w-9" />
          <span className="text-2xl font-paperozi font-extrabold">
            Dear. ___
          </span>
        </div>

        <form onSubmit={submit} className="w-full space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full rounded-lg border border-outline px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button
            type="submit"
            className="w-full py-2 text-sm font-normal"
            disabled={isLoading || password.length === 0}
          >
            {isLoading ? "확인 중..." : "편지 열람"}
          </Button>
        </form>
      </div>
    </section>
  );
}
