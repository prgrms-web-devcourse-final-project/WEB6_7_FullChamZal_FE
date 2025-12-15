"use client";

import { CheckCircle, Clock, Hourglass, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import DataTable from "../DataTable";
import { PHONE_LOGS } from "@/data/admin/AdminPhone";

function filterPhoneLogs(logs: PhoneLog[], tab: string, query: string) {
  let result = [...logs];

  if (tab === "pending") result = result.filter((l) => l.status === "pending");
  if (tab === "verified")
    result = result.filter((l) => l.status === "verified");
  if (tab === "failed") result = result.filter((l) => l.status === "failed");
  if (tab === "expired") result = result.filter((l) => l.status === "expired");

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.ip.includes(q)
    );
  }

  return result;
}

function StatusBadge({ status }: { status: PhoneVerifyStatus }) {
  if (status === "verified") {
    return (
      <div className="inline-flex items-center gap-1 rounded-lg bg-[#DCFCE7] px-3 py-1 text-green-800">
        <CheckCircle size={14} />
        완료
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="inline-flex items-center gap-1 rounded-lg bg-[#F5EDE4] px-3 py-1 text-stone-800">
        <Clock size={14} />
        대기
      </div>
    );
  }

  if (status === "expired") {
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
  const [logs] = useState<PhoneLog[]>(PHONE_LOGS);

  const rows = useMemo(
    () => filterPhoneLogs(logs, tab, query),
    [logs, tab, query]
  );

  const columns = useMemo(
    () => [
      { key: "id", header: "ID", cell: (l: PhoneLog) => `#${l.id}` },
      {
        key: "user",
        header: "사용자",
        cell: (l: PhoneLog) => (
          <div className="flex flex-col">
            <span>{l.userName}</span>
          </div>
        ),
      },
      { key: "phone", header: "전화번호", cell: (l: PhoneLog) => l.phone },
      {
        key: "code",
        header: "인증코드",
        cell: (l: PhoneLog) => (
          <span className="py-1 px-2 bg-gray-100 rounded-md">{l.code}</span>
        ),
      },
      {
        key: "requestedAt",
        header: "요청시간",
        cell: (l: PhoneLog) => l.requestedAt,
      },
      {
        key: "completedAt",
        header: "완료 시간",
        cell: (l: PhoneLog) => l.completedAt ?? "-",
      },
      { key: "ip", header: "IP주소", cell: (l: PhoneLog) => l.ip },
      { key: "attempt", header: "시도", cell: (l: PhoneLog) => l.attempt },
      {
        key: "status",
        header: "상태",
        cell: (l: PhoneLog) => <StatusBadge status={l.status} />,
      },
    ],
    []
  );

  return (
    <DataTable<PhoneLog>
      columns={columns}
      rows={rows}
      getRowKey={(l) => l.id}
      emptyMessage="표시할 인증 내역이 없습니다."
    />
  );
}
