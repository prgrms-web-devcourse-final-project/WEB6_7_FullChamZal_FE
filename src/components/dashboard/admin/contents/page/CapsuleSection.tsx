"use client";

import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";
import { useQuery } from "@tanstack/react-query";
import AdminDashboardPageSkeleton from "@/components/ui/skeleton/admin/AdminDashboardPageSkeleton";
import ApiError from "@/components/common/error/ApiError";

const CAPSULE_TABS = [
  { key: "all", label: "전체" },
  { key: "public", label: "공개" },
  { key: "private", label: "비공개" },
  { key: "locked", label: "잠긴 편지" },
  { key: "opened", label: "열린 편지" },
] as const;

export default function CapsuleSection() {
  const base = { query: "", page: 0, size: 1 as const };

  const qAll = useQuery({
    queryKey: ["adminCapsulesCount"],
    queryFn: ({ signal }) =>
      adminCapsulesApi.list({ tab: "", ...base, signal }),
    staleTime: 30_000,
  });

  const qPublic = useQuery({
    queryKey: ["adminCapsulesCount", "public"],
    queryFn: ({ signal }) =>
      adminCapsulesApi.list({ tab: "public", ...base, signal }),
    staleTime: 30_000,
  });

  const qPrivate = useQuery({
    queryKey: ["adminCapsulesCount", "private"],
    queryFn: ({ signal }) =>
      adminCapsulesApi.list({ tab: "private", ...base, signal }),
    staleTime: 30_000,
  });

  const qLocked = useQuery({
    queryKey: ["adminCapsulesCount", "locked"],
    queryFn: ({ signal }) =>
      adminCapsulesApi.list({ tab: "locked", ...base, signal }),
    staleTime: 30_000,
  });

  const isInitialLoading =
    qAll.isLoading ||
    qPublic.isLoading ||
    qPrivate.isLoading ||
    qLocked.isLoading;

  if (isInitialLoading) return <AdminDashboardPageSkeleton />;

  const hasError =
    qAll.isError || qPublic.isError || qPrivate.isError || qLocked.isError;
  if (hasError)
    return (
      <ApiError
        onRetry={() => {
          qAll.refetch();
          qPublic.refetch();
          qPrivate.refetch();
          qLocked.refetch();
        }}
      />
    );

  const counts = {
    total: qAll.data?.totalElements ?? 0,
    public: qPublic.data?.totalElements ?? 0,
    private: qPrivate.data?.totalElements ?? 0,
    lock: qLocked.data?.totalElements ?? 0,
  };

  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="편지 관리"
          content="전체 편지을 조회하고 관리할 수 있습니다"
        />

        <StatsOverview
          tabs={CAPSULE_TABS}
          totals={counts.total ?? 0}
          second={counts.public ?? 0}
          third={counts.private ?? 0}
          fourth={counts.lock ?? 0}
        />

        <AdminBody
          section="capsules"
          tabs={CAPSULE_TABS}
          defaultTab="all"
          searchPlaceholder="편지 제목 또는 작성자로 검색..."
        />
      </div>
    </>
  );
}
