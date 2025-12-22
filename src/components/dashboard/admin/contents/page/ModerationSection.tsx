"use client";

import { adminReportApi } from "@/lib/api/admin/reports/adminReports";
import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";
import { useQuery } from "@tanstack/react-query";

const REPORT_TABS = [
  { key: "all", label: "전체" },
  { key: "PASS", label: "통과" },
  { key: "ERROR", label: "차단" },
  { key: "FLAGGED", label: "플래그됨" },
] as const;

export default function ModerationSection() {
  const base = { query: "", page: 0, size: 1 as const };

  const qAll = useQuery({
    queryKey: ["adminReportCount", "all"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "all", ...base, signal }),
    staleTime: 30_000,
  });

  const qAccepted = useQuery({
    queryKey: ["adminReportCount", "accepted"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "accepted", ...base, signal }),
    staleTime: 30_000,
  });

  const qRejected = useQuery({
    queryKey: ["adminReportCount", "rejected"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "rejected", ...base, signal }),
    staleTime: 30_000,
  });

  const qPending = useQuery({
    queryKey: ["adminReportCount", "pending"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "pending", ...base, signal }),
    staleTime: 30_000,
  });

  const counts = {
    total: qAll.data?.totalElements ?? 0,
    accepted: qAccepted.data?.totalElements ?? 0,
    rejected: qRejected.data?.totalElements ?? 0,
    pending: qPending.data?.totalElements ?? 0,
  };

  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="편지 생성 로그"
          content="편지 생성 시 AI 모더레이션 로그를 확인합니다"
        />

        <StatsOverview
          tabs={REPORT_TABS}
          totals={counts.total ?? 0}
          second={counts.accepted ?? 0}
          third={counts.rejected ?? 0}
          fourth={counts.pending ?? 0}
        />

        <AdminBody
          section="reports"
          tabs={REPORT_TABS}
          defaultTab="all"
          searchPlaceholder="신고자 이름 또는 편지 아이디로 검색..."
        />
      </div>
    </>
  );
}
