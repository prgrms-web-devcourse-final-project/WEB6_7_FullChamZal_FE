/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CheckCircle, Clock, Hourglass, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DataTable from "../DataTable";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Pagination from "@/components/common/Pagination";
import { adminPhoneApi } from "@/lib/api/admin/phone/adminPhone";
import { formatDate } from "@/lib/hooks/formatDate";

function StatusBadge({ status }: { status: AdminPhoneStatus }) {
  if (status === "VERIFIED") {
    return (
      <div className="inline-flex items-center gap-1 rounded-lg bg-[#DCFCE7] px-3 py-1 text-green-800">
        <CheckCircle size={14} />
        완료
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="inline-flex items-center gap-1 rounded-lg bg-[#F5EDE4] px-3 py-1 text-stone-800">
        <Clock size={14} />
        대기
      </div>
    );
  }

  if (status === "EXPIRED") {
    return (
      <div className="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-3 py-1">
        <Hourglass size={14} />
        만료
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-red-800">
      <XCircle size={14} />
      실패
    </div>
  );
}

export default function PhoneList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const queryClient = useQueryClient();

  const listQueryKey = (p: number) =>
    ["adminPhone", tab, query, p, size] as const;

  // 탭/검색 변경 시 페이지 리셋 + 모달 닫기
  useEffect(() => {
    setPage(0);
  }, [tab, query]);

  const { data, isLoading } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: ({ signal }) =>
      adminPhoneApi.list({ tab, query, page, size, signal }),
    placeholderData: keepPreviousData,
  });

  const phoneData = data?.content ?? [];
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
          adminPhoneApi.list({ tab, query, page: p, size, signal }),
        staleTime: 30_000,
      });

    // 이전 페이지 (0이면 스킵)
    if (page > 0) prefetch(page - 1);

    // 다음 페이지 (마지막이면 스킵)
    if (page < lastPage) prefetch(page + 1);
  }, [data, lastPage, listQueryKey, page, size, query, queryClient, tab]);

  const columns = useMemo(
    () => [
      { key: "id", header: "ID", cell: (l: AdminPhone) => `#${l.id}` },

      {
        key: "phone",
        header: "전화번호",
        cell: (l: AdminPhone) => l.phoneNumberHash,
      },
      {
        key: "user",
        header: "인증 목적",
        cell: (l: AdminPhone) => (
          <div className="flex flex-col">
            <span>{l.purpose}</span>
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "인증 요청 시각",
        cell: (l: AdminPhone) => formatDate(l.createdAt),
      },
      {
        key: "verifiedAt",
        header: "인증 완료 시각",
        cell: (l: AdminPhone) =>
          l.verifiedAt ? formatDate(l.verifiedAt) : "-",
      },
      {
        key: "expiredAt",
        header: "인증 만료 시각",
        cell: (l: AdminPhone) => (l.expiredAt ? formatDate(l.expiredAt) : "-"),
      },
      {
        key: "attempt",
        header: "시도 횟수",
        cell: (l: AdminPhone) => l.attemptCount,
      },
      {
        key: "status",
        header: "인증 상태",
        cell: (l: AdminPhone) => <StatusBadge status={l.status} />,
      },
    ],
    []
  );

  return (
    <>
      <DataTable<AdminPhone>
        columns={columns}
        rows={phoneData}
        getRowKey={(l) => l.id}
        emptyMessage="표시할 인증 내역이 없습니다."
        isLoading={isLoading}
        skeletonRowCount={size}
      />

      <Pagination
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
      />
    </>
  );
}
