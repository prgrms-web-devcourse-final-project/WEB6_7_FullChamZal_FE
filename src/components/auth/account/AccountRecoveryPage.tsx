"use client";

import AccountRecoveryContent from "./AccountRecoveryContent";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl border border-outline rounded-2xl bg-white/80">
        <AccountRecoveryContent initialMode="FIND_ID" />
      </div>
    </div>
  );
}
