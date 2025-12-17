/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Ban, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import DataTable from "../DataTable";
import Pagination from "@/components/common/Pagination";
import { adminUsersApi } from "@/lib/api/admin/users/adminUsers";

export default function UserList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // 탭/검색 변경 시 페이지 리셋
  useEffect(() => {
    setPage(0);
  }, [tab, query]);

  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["adminUsers", tab, query, page, size],
    queryFn: ({ signal }) =>
      adminUsersApi.list({ tab, query, page, size, signal }),
    placeholderData: keepPreviousData,
  });

  const toggleMutation = useMutation({
    mutationFn: (params: { id: number; nextStatus: AdminStatus }) =>
      adminUsersApi.toggleStatus(params),

    // Optimistic update
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["adminUsers"] });

      const previous = queryClient.getQueryData<any>([
        "adminUsers",
        tab,
        query,
        page,
        size,
      ]);

      queryClient.setQueryData(
        ["adminUsers", tab, query, page, size],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map((u: AdminUser) =>
              u.id === params.id ? { ...u, status: params.nextStatus } : u
            ),
          };
        }
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          ["adminUsers", tab, query, page, size],
          ctx.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const users = usersQuery.data?.content ?? [];
  const totalElements = usersQuery.data?.totalElements ?? 0;

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
              <CheckCircle size={14} /> 활성
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-red-800">
              <Ban size={14} /> 정지
            </div>
          ),
      },
      {
        key: "action",
        header: "액션",
        cell: (u: AdminUser) => {
          const nextStatus: AdminStatus =
            u.status === "ACTIVE" ? "STOP" : "ACTIVE";

          return (
            <button
              type="button"
              disabled={toggleMutation.isPending}
              onClick={() => toggleMutation.mutate({ id: u.id, nextStatus })}
              className={`cursor-pointer px-3 py-1 rounded-lg text-white disabled:opacity-50 ${
                u.status === "ACTIVE"
                  ? "bg-primary hover:bg-red-300"
                  : "bg-admin/50 hover:bg-admin"
              }`}
            >
              {u.status === "ACTIVE" ? "정지" : "해제"}
            </button>
          );
        },
      },
    ],
    [toggleMutation]
  );

  const isInitialLoading = usersQuery.isLoading;

  return (
    <div className="space-y-3">
      <DataTable
        columns={columns}
        rows={users}
        getRowKey={(u: AdminUser) => u.id}
        emptyMessage={
          usersQuery.isError
            ? "불러오기에 실패했습니다."
            : "표시할 사용자가 없습니다."
        }
        isLoading={isInitialLoading}
        skeletonRowCount={size}
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
