/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Lock,
  Unlock,
  Clock,
  MapPin,
  Trash2,
  Eye,
  CircleAlert,
} from "lucide-react";
import DataTable from "../DataTable";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import Pagination from "@/components/common/Pagination";
import LetterDetailModal from "@/components/capsule/detail/LetterDetailModal";
import { formatDate } from "@/lib/hooks/formatDate";
import Modal from "@/components/common/Modal";
import { formatDateTime } from "@/lib/hooks/formatDateTime";

export default function CapsuleList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const queryClient = useQueryClient();
  const listQueryKey = (p: number) =>
    ["adminCapsules", tab, query, p, size] as const;

  const [page, setPage] = useState(0);
  const [size] = useState(6);

  // 모달 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<number | null>(
    null
  );

  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    deleted: boolean;
  } | null>(null);

  const isRestoring = deleteTarget?.deleted === false;

  // 탭/검색 변경 시 페이지 리셋 + 모달 닫기
  useEffect(() => {
    setPage(0);
    setIsDetailOpen(false);
    setSelectedCapsuleId(null);
    setIsDeletedModalOpen(false);
  }, [tab, query]);

  const { data, isLoading } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: ({ signal }) =>
      adminCapsulesApi.list({ tab, query, page, size, signal }),
    placeholderData: keepPreviousData,
  });

  const capsulesData = data?.content ?? [];
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
          adminCapsulesApi.list({ tab, query, page: p, size, signal }),
        staleTime: 30_000,
      });

    // 이전 페이지 (0이면 스킵)
    if (page > 0) prefetch(page - 1);

    // 다음 페이지 (마지막이면 스킵)
    if (page < lastPage) prefetch(page + 1);
  }, [data, lastPage, listQueryKey, page, size, query, queryClient, tab]);

  const openDetail = useCallback((id: number) => {
    setSelectedCapsuleId(id);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedCapsuleId(null);
  }, []);

  const openDeleteModal = (id: number, deleted: boolean) => {
    setDeleteTarget({ id, deleted });
    setIsDeletedModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeletedModalOpen(false);
    setDeleteTarget(null);
  };

  const toggleDeleteMutation = useMutation({
    mutationFn: (params: { capsuleId: number; deleted: boolean }) =>
      adminCapsulesApi.toggleDelete(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminCapsules"],
      });
      console.log("삭제 성공!");
    },

    onError: (error) => {
      console.error(error);
      alert("상태 변경에 실패했습니다.");
    },
  });

  const confirmDelete = () => {
    if (!deleteTarget) return;

    toggleDeleteMutation.mutate({
      capsuleId: deleteTarget.id,
      deleted: !deleteTarget.deleted,
    });

    closeDeleteModal();
  };

  const columns = useMemo(
    () => [
      { key: "id", header: "ID", cell: (c: AdminCapsule) => `#${c.id}` },
      {
        key: "title",
        header: "제목",
        cell: (c: AdminCapsule) => (
          <div className="flex gap-2 items-center">
            <span>{c.title}</span>
            {c.visibility === "PUBLIC" ? (
              <span className="py-0.5 px-2 text-xs bg-blue-100 text-blue-800 rounded-md">
                공개
              </span>
            ) : null}
          </div>
        ),
      },
      {
        key: "sender",
        header: "작성자",
        cell: (c: AdminCapsule) => c.writerNickname,
      },
      {
        key: "receiver",
        header: "수신자",
        cell: (c: AdminCapsule) => c.recipientName,
      },
      {
        key: "unlockType",
        header: "해제 타입",
        cell: (c: AdminCapsule) => {
          const bgTextClass =
            c.unlockType === "TIME"
              ? "bg-violet-100 text-violet-800"
              : c.unlockType === "LOCATION"
              ? "bg-orange-100 text-orange-800"
              : "bg-pink-100 text-pink-800";

          return (
            <div
              className={`inline-flex items-center gap-1 py-1 px-3 rounded-lg text-n ${bgTextClass}`}
            >
              {c.unlockType === "TIME" && <Clock size={14} />}
              {c.unlockType === "LOCATION" && <MapPin size={14} />}
              {c.unlockType === "TIME_AND_LOCATION" && (
                <div className="flex gap-1">
                  <Clock size={14} />
                  <MapPin size={14} />
                </div>
              )}
              <span>
                {c.unlockType === "TIME"
                  ? "시간"
                  : c.unlockType === "LOCATION"
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
        cell: (c: AdminCapsule) => {
          // 시간 포맷 (필요하면 기존 util로 교체)
          const timeText = c.unlockAt ? formatDateTime(c.unlockAt) : "-";

          // 장소 텍스트 (별칭 > 주소 > -)
          const locationText = c.locationAlias || c.address || "-";

          if (c.unlockType === "TIME") {
            return (
              <span className="line-clamp-1 max-w-60 inline-block">
                {timeText}
              </span>
            );
          }

          if (c.unlockType === "LOCATION") {
            return (
              <span className="line-clamp-1 max-w-60 inline-block">
                {locationText}
              </span>
            );
          }

          // TIME_AND_LOCATION
          return (
            <div className="flex flex-col text-sm max-w-60">
              <span className="line-clamp-1">{timeText}</span>
              <span className="line-clamp-1 text-text-3">{locationText}</span>
            </div>
          );
        },
      },
      {
        key: "createdAt",
        header: "생성일",
        cell: (c: AdminCapsule) => formatDate(c.createdAt),
      },
      {
        key: "status",
        header: "상태",
        cell: (c: AdminCapsule) =>
          c.deleted ? (
            <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-red-800">
              <Trash2 size={14} />
              삭제됨
            </div>
          ) : c.unlockAt === null ? (
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
              onClick={() => openDetail(c.id)}
              className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-admin/70 px-3 py-1 text-white hover:bg-admin"
            >
              <Eye size={14} />
              세부
            </button>
            {c.deleted ? (
              <button
                onClick={() => openDeleteModal(c.id, c.deleted)}
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              >
                <Trash2 size={14} />
                복구
              </button>
            ) : (
              <button
                onClick={() => openDeleteModal(c.id, c.deleted)}
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                <Trash2 size={14} />
                삭제
              </button>
            )}
          </div>
        ),
      },
    ],
    [openDetail]
  );

  return (
    <>
      <DataTable<AdminCapsule>
        columns={columns}
        rows={capsulesData}
        getRowKey={(c) => c.id}
        emptyMessage="표시할 편지이 없습니다."
        isLoading={isLoading}
        skeletonRowCount={size}
      />

      <Pagination
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
      />

      {/* 모달 렌더링: open일 때만 마운트(원하면 항상 마운트로 바꿔도 됨) */}
      {selectedCapsuleId !== null && (
        <LetterDetailModal
          capsuleId={selectedCapsuleId}
          open={isDetailOpen}
          onClose={closeDetail}
          role="ADMIN"
        />
      )}

      {isDeletedModalOpen && (
        <Modal open={isDeletedModalOpen} onClose={closeDeleteModal}>
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-110 bg-white p-8 rounded-2xl flex flex-col items-center justify-center gap-6">
              <h3 className="text-xl">
                정말로 편지를{" "}
                <span
                  className={`${
                    !isRestoring ? "text-blue-800" : "text-primary"
                  }`}
                >
                  {!isRestoring ? "복구" : "삭제"}
                </span>
                하시겠습니까?
              </h3>

              <div className="text-text-3 flex items-center gap-0.5">
                <CircleAlert size={20} />
                <p className="text-center">
                  {!isRestoring
                    ? "복구 후 다시 목록에 표시됩니다."
                    : "삭제 후에는 되돌릴 수 없습니다."}
                </p>
              </div>

              <div className="w-full flex gap-4">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="cursor-pointer flex-1 border border-outline py-2 rounded-lg"
                >
                  닫기
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={toggleDeleteMutation.isPending}
                  className={`cursor-pointer flex-1  text-white py-2 rounded-lg disabled:opacity-60 ${
                    !isRestoring
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-primary-3 hover:bg-primary-2"
                  }`}
                >
                  {!isRestoring ? "복구" : "삭제"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
