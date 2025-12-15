"use client";

import AdminBody from "../body/AdminBody";
import AdminHeader from "../AdminHeader";
import StatsOverview from "../StatsOverview";
import { useAdminUsersStore } from "@/store/admin/adminUsersStore";
import { useMemo } from "react";

const USER_TABS = [
  { key: "all", label: "전체" },
  { key: "active", label: "활성 사용자" },
  { key: "stop", label: "정지된 사용자" },
  { key: "reported", label: "신고 누적" },
] as const;

export default function UsersSection() {
  const { users, totalElements } = useAdminUsersStore();

  const counts = useMemo(() => {
    let active = 0;
    let stop = 0;
    let reported = 0;

    for (const u of users) {
      if (u.status === "ACTIVE") active++;
      if (u.status === "STOP") stop++;
      if ((u.reportCount ?? 0) >= 1) reported++;
    }

    return { active, stop, reported };
  }, [users]);

  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="사용자 관리"
          content="전체 회원을 조회하고 관리할 수 있습니다"
        />

        <StatsOverview tabs={USER_TABS} totals={totalElements} />

        <AdminBody
          section="users"
          tabs={USER_TABS}
          defaultTab="all"
          searchPlaceholder="이름 또는 이메일로 검색..."
        />
      </div>
    </>
  );
}
