"use client";

import { useState } from "react";
import ReportCard from "./ReportCard";
import ReportDetailModal from "./ReportDetailModal";
import { useQuery } from "@tanstack/react-query";
import { adminReportApi } from "@/lib/api/admin/reports/adminReports";

const mockAdminReports: AdminReport[] = [
  {
    id: 1,
    targetType: "CAPSULE",
    targetId: 12,
    reporterId: 101,
    reporterNickname: "익명유저1",
    reasonType: "SPAM",
    status: "PENDING",
    createdAt: "2025-12-15T09:21:11.123456",
  },
  {
    id: 2,
    targetType: "LETTER",
    targetId: 33,
    reporterId: 102,
    reporterNickname: "민지",
    reasonType: "ABUSE",
    status: "APPROVED",
    createdAt: "2025-12-15T10:02:44.654321",
  },
  {
    id: 3,
    targetType: "LETTER",
    targetId: 87,
    reporterId: null,
    reporterNickname: null,
    reasonType: "HATE",
    status: "PENDING",
    createdAt: "2025-12-15T11:48:09.998877",
  },
  {
    id: 4,
    targetType: "CAPSULE",
    targetId: 4,
    reporterId: null,
    reporterNickname: null,
    reasonType: "ETC",
    status: "REJECTED",
    createdAt: "2025-12-15T14:07:03.467158",
  },
  {
    id: 5,
    targetType: "CAPSULE",
    targetId: 19,
    reporterId: 205,
    reporterNickname: "tester123",
    reasonType: "SEXUAL",
    status: "APPROVED",
    createdAt: "2025-12-15T15:31:55.222333",
  },
];

export default function ReportList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [openDetail, setOpenDetail] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const reportData = mockAdminReports;

  const listQueryKey = (p: number) =>
    ["adminReports", tab, query, p, size] as const;

  const { data, isLoading } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab, query, page, size, signal }),
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportData.map((item) => (
          <ReportCard
            key={item.id}
            report={item}
            onApprove={(id) => console.log("approve", id)}
            onReject={(id) => console.log("reject", id)}
            onOpenDetail={() => setOpenDetail(true)}
          />
        ))}
      </div>

      <ReportDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
}
