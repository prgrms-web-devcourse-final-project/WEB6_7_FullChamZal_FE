"use client";

import { useState } from "react";
import ReportCard from "./ReportCard";
import ReportDetailModal from "./ReportDetailModal";
import { useQuery } from "@tanstack/react-query";
import { adminReportApi } from "@/lib/api/admin/reports/adminReports";

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
  const [size] = useState(10);

  const listQueryKey = (p: number) =>
    ["adminReports", tab, query, p, size] as const;

  const { data } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab, query, page, size, signal }),
  });

  const reportData = data?.content ?? [];

  return (
    <>
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
