/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Pagination from "@/components/common/Pagination";
import { AdminModerationApi } from "@/lib/api/admin/moderation/adminModeration";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import DataTable from "../DataTable";
import { AlertCircle, MinusCircle, XCircle } from "lucide-react";
import ModerationDetail from "./ModerationDetail";

function DecisionBadge({ decision }: { decision: ModerationDecision }) {
  if (decision === "SKIPPED") {
    return (
      <div className="inline-flex items-center gap-1 text-green-800">
        <MinusCircle size={14} />
        건너뜀
      </div>
    );
  }

  if (decision === "ERROR") {
    return (
      <div className="inline-flex items-center gap-1 text-red-800">
        <XCircle size={14} />
        차단
      </div>
    );
  }

  if (decision === "FLAGGED") {
    return (
      <div className="inline-flex items-center gap-1 text-orange-500">
        <AlertCircle size={14} />
        플래그
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 text-red-800">
      <XCircle size={14} />
      실패
    </div>
  );
}

function FlaggedBadge({ flagged }: { flagged: boolean }) {
  if (flagged) {
    return (
      <div className="inline-flex items-center gap-1 text-orange-500">
        <AlertCircle size={14} />예
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 text-gray-800">아니오</div>
  );
}

export default function ModerationList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const queryClient = useQueryClient();

  // 상세 모달 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const listQueryKey = (p: number) =>
    ["adminModeration", tab, query, p, size] as const;

  // 탭/검색 변경 시 페이지 리셋 + 모달 닫기
  useEffect(() => {
    setPage(0);
    setDetailOpen(false);
    setSelectedId(null);
  }, [tab, query]);

  const { data, isLoading } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: ({ signal }) =>
      AdminModerationApi.list({ tab, query, page, size, signal }),
    placeholderData: keepPreviousData,
  });

  const moderationData = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const lastPage = totalPages - 1;

  // 인접 페이지(이전/다음) 프리패치
  useEffect(() => {
    if (!data) return;

    const prefetch = (p: number) =>
      queryClient.prefetchQuery({
        queryKey: listQueryKey(p),
        queryFn: ({ signal }) =>
          AdminModerationApi.list({ tab, query, page: p, size, signal }),
        staleTime: 30_000,
      });

    if (page > 0) prefetch(page - 1);
    if (page < lastPage) prefetch(page + 1);
  }, [data, lastPage, listQueryKey, page, size, query, queryClient, tab]);

  // 상세 조회
  const prefetchDetail = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ["adminModerationDetail", id],
      queryFn: ({ signal }) => AdminModerationApi.get({ id, signal }),
      staleTime: 30_000,
    });
  };

  const columns = useMemo(
    () => [
      {
        key: "id",
        header: "로그 ID",
        cell: (m: AdminModeration) => `#${m.id}`,
      },
      {
        key: "createdAt",
        header: "생성 시간",
        cell: (m: AdminModeration) => m.createdAt,
      },
      {
        key: "capsuleId",
        header: "캡슐 ID",
        cell: (m: AdminModeration) => m.capsuleId,
      },
      {
        key: "userId",
        header: "회원 ID",
        cell: (m: AdminModeration) => m.actorMemberId,
      },
      { key: "model", header: "모델", cell: (m: AdminModeration) => m.model },
      {
        key: "decision",
        header: "결정",
        cell: (m: AdminModeration) => <DecisionBadge decision={m.decision} />,
      },
      {
        key: "flagged",
        header: "플래그",
        cell: (m: AdminModeration) => <FlaggedBadge flagged={m.flagged} />,
      },
      {
        key: "actions",
        header: "액션",
        cell: (m: AdminModeration) => (
          <button
            className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-admin/70 px-3 py-1 text-white hover:bg-admin"
            onClick={() => {
              setSelectedId(m.id);
              setDetailOpen(true);
            }}
            onMouseEnter={() => prefetchDetail(m.id)}
          >
            상세보기
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <DataTable<AdminModeration>
        columns={columns}
        rows={moderationData}
        getRowKey={(l) => l.id}
        emptyMessage="표시할 생성 로그 내역이 없습니다."
        isLoading={isLoading}
        skeletonRowCount={size}
      />

      <Pagination
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
      />

      {/* 모달 */}
      <ModerationDetail
        open={detailOpen}
        id={selectedId}
        onClose={() => {
          setDetailOpen(false);
          setSelectedId(null);
        }}
      />
    </>
  );
}
