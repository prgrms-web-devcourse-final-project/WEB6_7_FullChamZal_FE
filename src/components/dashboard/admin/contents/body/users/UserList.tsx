/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import ConfirmModal from "@/components/common/ConfirmModal";

export default function UserList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [page, setPage] = useState(0);
  const [size] = useState(6);

  /* 확인 모달 */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: number;
    nextStatus: AdminStatus;
    nickname?: string;
  } | null>(null);

  // 탭/검색 변경 시 페이지 리셋
  useEffect(() => {
    setPage(0);
  }, [tab, query]);

  const queryClient = useQueryClient();
  const listQueryKey = (p: number) =>
    ["adminUsers", tab, query, p, size] as const;

  const { data, isLoading } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: ({ signal }) =>
      adminUsersApi.list({ tab, query, page, size, signal }),
    placeholderData: keepPreviousData,
  });

  const users = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const lastPage = totalPages - 1;

  // 인접 페이지(이전/다음) 프리패치
  useEffect(() => {
    if (!data) return; // totalElements 없으면 lastPage 판단이 애매하니 스킵

    const prefetch = (p: number) =>
      queryClient.prefetchQuery({
        queryKey: listQueryKey(p),
        queryFn: ({ signal }) =>
          adminUsersApi.list({ tab, query, page: p, size, signal }),
        staleTime: 30_000,
      });

    // 이전 페이지 (0이면 스킵)
    if (page > 0) prefetch(page - 1);

    // 다음 페이지 (마지막이면 스킵)
    if (page < lastPage) prefetch(page + 1);
  }, [data, lastPage, listQueryKey, page, size, query, queryClient, tab]);

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
        header: "편지",
        cell: (u: AdminUser) => u.capsuleCount,
      },
      {
        key: "blockedCapsuleCount",
        header: "차단 편지",
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
          ) : u.status === "STOP" ? (
            <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-red-800">
              <Ban size={14} /> 정지
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-lg bg-admin px-3 py-1 text-white">
              <Ban size={14} /> 탈퇴
            </div>
          ),
      },
      {
        key: "action",
        header: "액션",
        cell: (u: AdminUser) => {
          const nextStatus: AdminStatus =
            u.status === "ACTIVE" ? "STOP" : "ACTIVE";

          return u.status === "EXIT" ? null : (
            <button
              type="button"
              disabled={toggleMutation.isPending}
              onClick={() => {
                setPendingAction({
                  id: u.id,
                  nextStatus,
                  nickname: u.nickname,
                });
                setConfirmOpen(true);
              }}
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

  return (
    <>
      <ConfirmModal
        active={pendingAction?.nextStatus === "STOP" ? "fail" : "success"}
        title={
          pendingAction?.nextStatus === "STOP" ? "사용자 정지" : "정지 해제"
        }
        content={
          pendingAction?.nextStatus === "STOP"
            ? `${pendingAction?.nickname ?? "해당 사용자"}를 정지하시겠습니까?`
            : `${
                pendingAction?.nickname ?? "해당 사용자"
              }의 정지를 해제하시겠습니까?`
        }
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingAction(null);
        }}
        onConfirm={() => {
          if (!pendingAction) return;
          toggleMutation.mutate({
            id: pendingAction.id,
            nextStatus: pendingAction.nextStatus,
          });
          setConfirmOpen(false);
          setPendingAction(null);
        }}
      />

      <div className="space-y-3">
        <DataTable
          columns={columns}
          rows={users}
          getRowKey={(u: AdminUser) => u.id}
          emptyMessage={"표시할 사용자가 없습니다."}
          isLoading={isLoading}
          skeletonRowCount={size}
        />

        <Pagination
          page={page}
          size={size}
          totalElements={totalElements}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
