"use client";

import { USERS } from "@/data/AdminUser";
import { Ban, CheckCircle } from "lucide-react";
import { useState } from "react";

function filterUsers(users: User[], tab: string, query: string) {
  let result = [...users];

  // 🔹 tab 필터
  if (tab === "active") {
    result = result.filter((u) => u.status === "active");
  }

  if (tab === "suspended") {
    result = result.filter((u) => u.status === "suspended");
  }

  if (tab === "reported") {
    result = result.filter((u) => u.reportCount > 0);
  }

  // 검색어 필터
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
  const [users, setUsers] = useState(USERS);

  /* 여기에서 데이터 걸러서 불러와서 보여주기 */
  const filteredUsers = filterUsers(users, tab, query);

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "active" ? "suspended" : "active",
            }
          : u
      )
    );
  };

  return (
    <div className="rounded-2xl border border-outline overflow-hidden bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline [&>th]:py-4 [&>th]:px-6 text-left">
            <th>ID</th>
            <th>이름</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>가입일</th>
            <th>보낸 편지</th>
            <th>받은 편지</th>
            <th>신고</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td
                colSpan={11}
                className="py-10 text-center text-sm text-text-4"
              >
                표시할 사용자가 없습니다.
              </td>
            </tr>
          )}

          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="text-sm border-b border-sub last:border-b-0 [&>td]:py-4 [&>td]:px-6"
            >
              <td>#{user.id}</td>
              <td>{user.name}</td>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.joinedAt}</td>
              <td>{user.sent}</td>
              <td>{user.received}</td>
              <td>{user.reportCount}</td>
              <td>
                {user.status === "active" ? (
                  <div className="inline-flex items-center gap-1 rounded-lg bg-[#DCFCE7] px-3 py-1 text-green-800">
                    <CheckCircle size={14} />
                    활성
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-red-800">
                    <Ban size={14} />
                    정지
                  </div>
                )}
              </td>
              <td>
                <button
                  onClick={() => toggleStatus(user.id)}
                  className={`cursor-pointer px-3 py-1 rounded-lg text-white ${
                    user.status === "active"
                      ? "bg-primary hover:bg-red-300"
                      : "bg-admin/50 hover:bg-admin"
                  }`}
                >
                  {user.status === "active" ? "정지" : "해제"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
