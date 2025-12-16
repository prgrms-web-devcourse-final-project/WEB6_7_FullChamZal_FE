"use client";

import { useMemo, useState, useCallback } from "react";
import { Lock, Unlock, Clock, MapPin, Trash2, Eye } from "lucide-react";
import DataTable from "../DataTable";
import { CAPSULES } from "@/data/admin/AdminCapsule";

function filterCapsules(capsules: AdminCapsule[], tab: string, query: string) {
  let result = [...capsules];

  // tab 필터
  if (tab === "public")
    result = result.filter((c) => c.visibility === "public");
  if (tab === "private")
    result = result.filter((c) => c.visibility === "private");
  if (tab === "locked") result = result.filter((c) => c.status === "locked");
  if (tab === "opened") result = result.filter((c) => c.status === "opened");

  // 검색어 필터 (제목/발신자/수신자)
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.sender.toLowerCase().includes(q) ||
        c.receiver.toLowerCase().includes(q)
    );
  }

  return result;
}

export default function CapsuleList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [capsules, setCapsules] = useState<AdminCapsule[]>(CAPSULES);

  const onDelete = useCallback((id: number) => {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const onViewDetail = useCallback((id: number) => {
    // TODO: 라우팅/모달로 연결
    // router.push(`/admin/dashboard/capsules/${id}`);
    console.log("view detail:", id);
  }, []);

  const rows = useMemo(
    () => filterCapsules(capsules, tab, query),
    [capsules, tab, query]
  );

  const columns = useMemo(
    () => [
      { key: "id", header: "ID", cell: (c: AdminCapsule) => `#${c.id}` },
      {
        key: "title",
        header: "제목",
        cell: (c: AdminCapsule) => (
          <div className="flex gap-2 items-center">
            <span>{c.title}</span>
            {c.visibility === "public" ? (
              <span className="py-0.5 px-2 text-xs bg-blue-100 text-blue-800 rounded-md">
                공개
              </span>
            ) : (
              ""
            )}
          </div>
        ),
      },
      { key: "sender", header: "발신자", cell: (c: AdminCapsule) => c.sender },
      {
        key: "receiver",
        header: "수신자",
        cell: (c: AdminCapsule) => c.receiver,
      },
      {
        key: "unlockType",
        header: "해제 타입",
        cell: (c: AdminCapsule) => {
          const bgTextClass =
            c.unlockType === "time"
              ? "bg-violet-100 text-violet-800" // 시간
              : c.unlockType === "location"
              ? "bg-orange-100 text-orange-800" // 위치
              : "bg-pink-100 text-pink-800"; // 시간+위치

          return (
            <div
              className={`inline-flex items-center gap-1 py-1 px-3 rounded-lg text-n ${bgTextClass}`}
            >
              {c.unlockType === "time" && <Clock size={14} />}
              {c.unlockType === "location" && <MapPin size={14} />}
              {c.unlockType === "time_location" && (
                <div className="flex gap-1">
                  <Clock size={14} />
                  <MapPin size={14} />
                </div>
              )}
              <span>
                {c.unlockType === "time"
                  ? "시간"
                  : c.unlockType === "location"
                  ? "위치"
                  : "시간+위치"}
              </span>
            </div>
          );
        },
      },
      {
        key: "unlockCondition",
        header: "해제 조건",
        cell: (c: AdminCapsule) => (
          <span className="line-clamp-1 max-w-60 inline-block">
            {c.unlockCondition}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "생성일",
        cell: (c: AdminCapsule) => c.createdAt,
      },
      {
        key: "status",
        header: "상태",
        cell: (c: AdminCapsule) =>
          c.status === "locked" ? (
            <div className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1 text-amber-800">
              <Lock size={14} />
              잠김
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 text-green-800">
              <Unlock size={14} />
              열림
            </div>
          ),
      },
      {
        key: "actions",
        header: "액션",
        cell: (c: AdminCapsule) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetail(c.id)}
              className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-admin/70 px-3 py-1 text-white hover:bg-admin"
            >
              <Eye size={14} />
              세부
            </button>
            <button
              onClick={() => onDelete(c.id)}
              className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            >
              <Trash2 size={14} />
              삭제
            </button>
          </div>
        ),
      },
    ],
    [onDelete, onViewDetail]
  );

  return (
    <DataTable<AdminCapsule>
      columns={columns}
      rows={rows}
      getRowKey={(c) => c.id}
      emptyMessage="표시할 캡슐이 없습니다."
    />
  );
}
