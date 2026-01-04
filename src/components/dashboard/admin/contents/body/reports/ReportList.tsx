/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import ReportDetailModal from "./detail/ReportDetailModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminReportApi } from "@/lib/api/admin/reports/adminReports";
import Pagination from "@/components/common/Pagination";

export default function ReportList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(4);
  const queryClient = useQueryClient();

  const listQueryKey = (p: number) =>
    ["adminReports", tab, query, p, size] as const;

  const { data, isLoading } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab, query, page, size, signal }),
  });
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
          adminReportApi.list({ tab, query, page: p, size, signal }),
        staleTime: 30_000,
      });

    if (page > 0) prefetch(page - 1);
    if (page < lastPage) prefetch(page + 1);
  }, [data, lastPage, listQueryKey, page, size, query, queryClient, tab]);

  const reportData = data?.content ?? [];

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full h-55 rounded-xl bg-gray-200"></div>
          <div className="w-full h-55 rounded-xl bg-gray-200"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportData.map((item) => (
            <ReportCard
              key={item.id}
              report={item}
              onOpenDetail={(id: number) => {
                setSelectedReportId(id);
                setOpenDetail(true);
              }}
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
      />

      <ReportDetailModal
        open={openDetail}
        reportId={selectedReportId}
        onClose={() => {
          setOpenDetail(false);
          setSelectedReportId(null);
        }}
      />
    </>
  );
}
