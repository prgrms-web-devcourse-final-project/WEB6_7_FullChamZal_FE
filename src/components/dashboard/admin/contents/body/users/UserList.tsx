"use client";

import { Ban, CheckCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import DataTable from "../DataTable";
import Pagination from "@/components/common/Pagination";
import { useAdminUsersStore } from "@/store/admin/adminUsersStore";

export default function UserList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const {
    users,
    totalElements,
    loading,
    page,
    size,
    setPage,
    resetPage,
    fetchUsers,
    toggleStatus,
  } = useAdminUsersStore();

  // tab/query 바뀌면 page 리셋
  useEffect(() => {
    resetPage();
  }, [tab, query, resetPage]);

  // 데이터 fetch
  useEffect(() => {
    fetchUsers({ tab, query });
  }, [tab, query, page, size, fetchUsers]);

  const columns = useMemo(
    () => [
      { key: "id", header: "ID", cell: (u: AdminUser) => `#${u.id}` },
      { key: "userId", header: "사용자", cell: (u: AdminUser) => u.userId },
      { key: "nickname", header: "닉네임", cell: (u: AdminUser) => u.nickname },
      {
        key: "phoneNumber",
        header: "전화번호",
        cell: (u: AdminUser) => u.phoneNumber,
      },
      {
        key: "capsuleCount",
        header: "캡슐",
        cell: (u: AdminUser) => u.capsuleCount,
      },
      {
        key: "blockedCapsuleCount",
        header: "차단 캡슐",
        cell: (u: AdminUser) => u.blockedCapsuleCount,
      },
      {
        key: "reportCount",
        header: "신고",
        cell: (u: AdminUser) => u.reportCount,
      },
      {
        key: "createdAt",
        header: "가입일",
        cell: (u: AdminUser) => (u.createdAt ? u.createdAt.slice(0, 10) : "-"),
      },
      {
        key: "status",
        header: "상태",
        cell: (u: AdminUser) =>
          u.status === "ACTIVE" ? (
            <div className="inline-flex items-center gap-1 rounded-lg bg-[#DCFCE7] px-3 py-1 text-green-800">
              <CheckCircle size={14} />
              활성
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-red-800">
              <Ban size={14} />
              정지
            </div>
          ),
      },
      {
        key: "action",
        header: "액션",
        cell: (u: AdminUser) => (
          <button
            type="button"
            onClick={async () => {
              try {
                await toggleStatus(u.id);
              } catch {
                alert("상태 변경에 실패했습니다.");
              }
            }}
            className={`cursor-pointer px-3 py-1 rounded-lg text-white ${
              u.status === "ACTIVE"
                ? "bg-primary hover:bg-red-300"
                : "bg-admin/50 hover:bg-admin"
            }`}
          >
            {u.status === "ACTIVE" ? "정지" : "해제"}
          </button>
        ),
      },
    ],
    [toggleStatus]
  );

  return (
    <div className="space-y-3">
      {loading && <div className="text-sm text-text-4">불러오는 중...</div>}

      <DataTable
        columns={columns}
        rows={users}
        getRowKey={(u: AdminUser) => u.id}
        emptyMessage="표시할 사용자가 없습니다."
      />

      <Pagination
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
      />
    </div>
  );
}
