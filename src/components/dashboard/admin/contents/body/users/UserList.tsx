"use client";

import { USERS } from "@/data/admin/AdminUser";
import { Ban, CheckCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import DataTable from "../DataTable";

function filterUsers(users: AdminUser[], tab: string, query: string) {
  let result = [...users];

  if (tab === "active") result = result.filter((u) => u.status === "active");
  if (tab === "suspended")
    result = result.filter((u) => u.status === "suspended");
  if (tab === "reported") result = result.filter((u) => u.reportCount > 0);

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  return result;
}

export default function UserList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>(USERS);

  const toggleStatus = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
  }, []);

  const filteredUsers = useMemo(
    () => filterUsers(users, tab, query),
    [users, tab, query]
  );

  const columns = useMemo(
    () => [
      { key: "id", header: "ID", cell: (u: AdminUser) => `#${u.id}` },
      { key: "name", header: "이름", cell: (u: AdminUser) => u.name },
      { key: "nickname", header: "닉네임", cell: (u: AdminUser) => u.nickname },
      { key: "email", header: "이메일", cell: (u: AdminUser) => u.email },
      { key: "phone", header: "전화번호", cell: (u: AdminUser) => u.phone },
      { key: "joinedAt", header: "가입일", cell: (u: AdminUser) => u.joinedAt },
      { key: "sent", header: "보낸 편지", cell: (u: AdminUser) => u.sent },
      {
        key: "received",
        header: "받은 편지",
        cell: (u: AdminUser) => u.received,
      },
      { key: "report", header: "신고", cell: (u: AdminUser) => u.reportCount },
      {
        key: "status",
        header: "상태",
        cell: (u: AdminUser) =>
          u.status === "active" ? (
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
            onClick={() => toggleStatus(u.id)}
            className={`cursor-pointer px-3 py-1 rounded-lg text-white ${
              u.status === "active"
                ? "bg-primary hover:bg-red-300"
                : "bg-admin/50 hover:bg-admin"
            }`}
          >
            {u.status === "active" ? "정지" : "해제"}
          </button>
        ),
      },
    ],
    [toggleStatus]
  );

  return (
    <DataTable<AdminUser>
      columns={columns}
      rows={filteredUsers}
      getRowKey={(u) => u.id}
      emptyMessage="표시할 사용자가 없습니다."
    />
  );
}
