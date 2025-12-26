"use client";

import { useState } from "react";
import OAuthProfileModal from "@/components/auth/OauthProfileModal";
import type { MemberMeDetail } from "@/lib/api/members/members";

export default function DashboardShell({
  children,
  me,
}: {
  children: React.ReactNode;
  me: MemberMeDetail | null;
}) {
  // needs 계산: memo 필요도 없음(경고 줄이려면 그냥 계산)
  const needs = !me?.nickname || !me?.phoneNumber;

  // 한번 닫으면 이 세션에서는 안 뜨게(원하면 localStorage로 확장 가능)
  const [dismissed, setDismissed] = useState(false);

  // state로 setOpen 하지 말고 "계산된 open" 사용
  const open = needs && !dismissed;

  return (
    <>
      {children}
      <OAuthProfileModal open={open} onClose={() => setDismissed(true)} />
    </>
  );
}
