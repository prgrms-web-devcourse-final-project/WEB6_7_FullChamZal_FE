"use client";

import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";
import { useQuery } from "@tanstack/react-query";
import { AdminModerationApi } from "@/lib/api/admin/moderation/adminModeration";
import AdminDashboardPageSkeleton from "@/components/ui/skeleton/admin/AdminDashboardPageSkeleton";
import ApiError from "@/components/common/error/ApiError";

const REPORT_TABS = [
  { key: "all", label: "전체" },
  { key: "skipped", label: "건너뜀" },
  { key: "error", label: "차단" },
  { key: "flagged", label: "플래그됨" },
] as const;

export default function ModerationSection() {
  const base = { query: "", page: 0, size: 1 as const };

  const qAll = useQuery({
    queryKey: ["adminModerationCount", "all"],
    queryFn: ({ signal }) =>
      AdminModerationApi.list({ tab: "all", ...base, signal }),
    staleTime: 30_000,
  });

  const qSkipped = useQuery({
    queryKey: ["adminModerationCount", "skipped"],
    queryFn: ({ signal }) =>
      AdminModerationApi.list({ tab: "skipped", ...base, signal }),
    staleTime: 30_000,
  });

  const qError = useQuery({
    queryKey: ["adminModerationCount", "error"],
    queryFn: ({ signal }) =>
      AdminModerationApi.list({ tab: "error", ...base, signal }),
    staleTime: 30_000,
  });

  const qFlagged = useQuery({
    queryKey: ["adminModerationCount", "flagged"],
    queryFn: ({ signal }) =>
      AdminModerationApi.list({ tab: "flagged", ...base, signal }),
    staleTime: 30_000,
  });

  const isInitialLoading =
    qAll.isLoading ||
    qSkipped.isLoading ||
    qError.isLoading ||
    qFlagged.isLoading;

  if (isInitialLoading) return <AdminDashboardPageSkeleton />;

  const hasError =
    qAll.isError || qSkipped.isError || qError.isError || qFlagged.isError;
  if (hasError)
    return (
      <ApiError
        onRetry={() => {
          qAll.refetch();
          qSkipped.refetch();
          qError.refetch();
          qFlagged.refetch();
        }}
      />
    );

  const counts = {
    total: qAll.data?.totalElements ?? 0,
    skipped: qSkipped.data?.totalElements ?? 0,
    error: qError.data?.totalElements ?? 0,
    flagged: qFlagged.data?.totalElements ?? 0,
  };

  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="편지 생성 로그"
          content="편지 생성 시 AI 검증 로그를 확인합니다"
        />

        <StatsOverview
          tabs={REPORT_TABS}
          totals={counts.total ?? 0}
          second={counts.skipped ?? 0}
          third={counts.error ?? 0}
          fourth={counts.flagged ?? 0}
        />

        <AdminBody
          section="moderation"
          tabs={REPORT_TABS}
          defaultTab="all"
          searchPlaceholder="편지 작성자 아이디로 검색..."
        />
      </div>
    </>
  );
}
