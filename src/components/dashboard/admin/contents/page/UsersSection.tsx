"use client";

import AdminBody from "../body/AdminBody";
import AdminHeader from "../AdminHeader";
import StatsOverview from "../StatsOverview";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminUsers } from "@/lib/api/admin/users/adminUsers";

const USER_TABS = [
  { key: "all", label: "전체" },
  { key: "active", label: "활성 사용자" },
  { key: "stop", label: "정지된 사용자" },
  { key: "reported", label: "신고 누적" },
] as const;

export default function UsersSection() {
  // 상단 통계는 "요약값"만 가져오면 되니까 page=0, size=1 정도로 최소 요청
  const summaryQuery = useQuery({
    queryKey: ["adminUsersSummary"],
    queryFn: ({ signal }) =>
      fetchAdminUsers({
        tab: "all",
        query: "",
        page: 0,
        size: 1,
        signal,
      }),
    staleTime: 30_000,
  });

  const totals = summaryQuery.data?.totalElements ?? 0;

  return (
    <div className="w-full space-y-8">
      <AdminHeader
        title="사용자 관리"
        content="전체 회원을 조회하고 관리할 수 있습니다"
      />

      <StatsOverview
        tabs={USER_TABS}
        totals={totals}
        // 만약 StatsOverview가 탭별 카운트를 받을 수 있다면
        // counts={{
        //   active: summaryQuery.data?.summary?.active ?? 0,
        //   stop: summaryQuery.data?.summary?.stop ?? 0,
        //   reported: summaryQuery.data?.summary?.reported ?? 0,
        // }}
        // isLoading={summaryQuery.isLoading}
      />

      <AdminBody
        section="users"
        tabs={USER_TABS}
        defaultTab="all"
        searchPlaceholder="이름 또는 이메일로 검색..."
      />
    </div>
  );
}
