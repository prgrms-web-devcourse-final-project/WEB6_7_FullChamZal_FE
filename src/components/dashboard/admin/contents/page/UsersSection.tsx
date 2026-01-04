"use client";

import AdminBody from "../body/AdminBody";
import AdminHeader from "../AdminHeader";
import StatsOverview from "../StatsOverview";
import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "@/lib/api/admin/users/adminUsers";
import AdminDashboardPageSkeleton from "@/components/skeleton/admin/AdminDashboardPageSkeleton";
import AdminError from "@/components/common/error/admin/AdminError";

const USER_TABS = [
  { key: "all", label: "전체" },
  { key: "active", label: "활성 사용자" },
  { key: "stop", label: "정지된 사용자" },
  { key: "exit", label: "탈퇴한 사용자" },
] as const;

export default function UsersSection() {
  const base = { query: "", page: 0, size: 1 as const };

  const qAll = useQuery({
    queryKey: ["adminUsersCount"],
    queryFn: ({ signal }) =>
      adminUsersApi.list({
        ...base,
        signal,
        tab: "",
      }),
    staleTime: 30_000,
  });

  const qActive = useQuery({
    queryKey: ["adminUsersCount", "active"],
    queryFn: ({ signal }) =>
      adminUsersApi.list({ tab: "active", ...base, signal }),
    staleTime: 30_000,
  });

  const qStop = useQuery({
    queryKey: ["adminUsersCount", "stop"],
    queryFn: ({ signal }) =>
      adminUsersApi.list({ tab: "stop", ...base, signal }),
    staleTime: 30_000,
  });

  const qExit = useQuery({
    queryKey: ["adminUsersCount", "exit"],
    queryFn: ({ signal }) =>
      adminUsersApi.list({ tab: "exit", ...base, signal }),
    staleTime: 30_000,
  });

  const isInitialLoading =
    qAll.isLoading || qActive.isLoading || qStop.isLoading || qExit.isLoading;

  if (isInitialLoading) return <AdminDashboardPageSkeleton />;

  const hasError =
    qAll.isError || qActive.isError || qStop.isError || qExit.isError;
  if (hasError)
    return (
      <AdminError
        onRetry={() => {
          qAll.refetch();
          qActive.refetch();
          qStop.refetch();
          qExit.refetch();
        }}
      />
    );

  const counts = {
    total: qAll.data?.totalElements ?? 0,
    active: qActive.data?.totalElements ?? 0,
    stopped: qStop.data?.totalElements ?? 0,
    reported: qExit.data?.totalElements ?? 0,
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 lg:space-y-8">
      <AdminHeader
        title="사용자 관리"
        content="전체 회원을 조회하고 관리할 수 있습니다"
      />

      <StatsOverview
        tabs={USER_TABS}
        totals={counts.total}
        second={counts.active}
        third={counts.stopped}
        fourth={counts.reported}
      />

      <AdminBody
        section="users"
        tabs={USER_TABS}
        defaultTab="all"
        searchPlaceholder="이름 또는 닉네임으로 검색..."
      />
    </div>
  );
}
