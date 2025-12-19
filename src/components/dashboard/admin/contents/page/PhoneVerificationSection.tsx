"use client";

import { adminPhoneApi } from "@/lib/api/admin/phone/adminPhone";
import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";
import { useQuery } from "@tanstack/react-query";

const PHONE_TABS = [
  { key: "all", label: "전체" },
  { key: "verified", label: "인증 성공" },
  { key: "expired", label: "만료" },
  { key: "pending", label: "대기중" },
] as const;

export default function PhoneVerificationSection() {
  const base = { query: "", page: 0, size: 1 as const };

  const qAll = useQuery({
    queryKey: ["adminPhoneCount", "all"],
    queryFn: ({ signal }) =>
      adminPhoneApi.list({
        ...base,
        signal,
        tab: "",
      }),
    staleTime: 30_000,
  });

  const qVerified = useQuery({
    queryKey: ["adminPhoneCount", "verified"],
    queryFn: ({ signal }) =>
      adminPhoneApi.list({ tab: "verified", ...base, signal }),
    staleTime: 30_000,
  });

  const qExpired = useQuery({
    queryKey: ["adminPhoneCount", "expired"],
    queryFn: ({ signal }) =>
      adminPhoneApi.list({ tab: "expired", ...base, signal }),
    staleTime: 30_000,
  });

  const qPending = useQuery({
    queryKey: ["adminPhoneCount", "pending"],
    queryFn: ({ signal }) =>
      adminPhoneApi.list({ tab: "pending", ...base, signal }),
    staleTime: 30_000,
  });

  const counts = {
    total: qAll.data?.totalElements ?? 0,
    verified: qVerified.data?.totalElements ?? 0,
    expired: qExpired.data?.totalElements ?? 0,
    pending: qPending.data?.totalElements ?? 0,
  };

  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="전화번호 인증 내역"
          content="전화번호 인증 내역을 시간 순서로 확인할 수 있습니다"
        />

        <StatsOverview
          tabs={PHONE_TABS}
          totals={counts.total}
          second={counts.verified}
          third={counts.expired}
          fourth={counts.pending}
        />

        <AdminBody
          section="phone"
          tabs={PHONE_TABS}
          defaultTab="all"
          searchPlaceholder="전화번호 또는 이름으로 검색..."
        />
      </div>
    </>
  );
}
