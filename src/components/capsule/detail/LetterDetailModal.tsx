/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { adminCapsulesApi } from "@/lib/api/admin/capsules/adminCapsules";
import { formatDate } from "@/lib/formatDate";
import { formatDateTime } from "@/lib/formatDateTime";
import { useQuery } from "@tanstack/react-query";
import {
  Archive,
  Bookmark,
  Clock,
  LinkIcon,
  MapPin,
  Reply,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LetterDetailModal({
  capsuleId,
  open,
  closeHref,
  mode,
  role = "USER",
  onClose,
}: {
  capsuleId: number;
  open?: boolean;
  closeHref?: string;
  mode?: string;
  role?: MemberRole;
  onClose?: () => void;
}) {
  const router = useRouter();

  // open이 false면 아예 렌더하지 않기
  if (!open) return null;

  const close = () => {
    if (closeHref) router.push(closeHref, { scroll: false });
    else router.back();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminCapsuleDetail", capsuleId],
    queryFn: ({ signal }) => adminCapsulesApi.detail({ capsuleId, signal }),
    enabled: open && capsuleId > 0,
  });

  const capsule = data;

  console.log(capsule);

  // 로딩 UI
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-9999 bg-black/50">
        <div className="flex h-full justify-center py-15">
          <div className="max-w-330 w-full rounded-2xl bg-white p-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">불러오는 중...</div>
              <button onClick={close} className="cursor-pointer text-primary">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* 데이터가 없을경우 */
  if (!capsule) {
    return (
      <div className="fixed inset-0 z-9999 bg-black/50">
        <div className="flex h-full justify-center py-15">
          <div className="max-w-330 w-full rounded-2xl bg-white p-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">편지를 찾을 수 없어요</div>
              <button
                type="button"
                onClick={role === "ADMIN" ? onClose : close}
                className="cursor-pointer text-primary"
              >
                <X size={24} />
              </button>
            </div>
            <p className="h-full mt-4 text-text-3 flex items-center justify-center">
              해당 편지에 대한 내용이 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 해제 조건 표시
  const isTime =
    capsule.unlockType === "TIME" || capsule.unlockType === "TIME_AND_LOCATION";

  const unlockLabel =
    capsule.unlockType === "TIME"
      ? capsule.unlockAt
        ? formatDateTime(capsule.unlockAt)
        : "시간 조건 없음"
      : capsule.unlockType === "LOCATION"
      ? capsule.locationName ?? "위치 조건 없음"
      : // TIME_AND_LOCATION
        `${
          capsule.unlockAt ? formatDateTime(capsule.unlockAt) : "시간 조건 없음"
        } · ${capsule.locationName ?? "위치 조건 없음"}`;

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 w-full min-h-screen">
      <div className="flex h-full justify-center md:p-15 p-6">
        <div className="flex flex-col max-w-300 w-full h-[calc(100vh-48px)] md:h-[calc(100vh-120px)] bg-white rounded-2xl">
          {/* Header */}
          <div className="shrink-0 border-b px-8 py-4">
            <div className="flex justify-between items-center gap-4">
              <div className="md:flex-1 truncate">{capsule.title}</div>

              <div
                className={`flex-1 flex items-center gap-1 ${
                  mode ? "justify-end" : "justify-center"
                }`}
              >
                <span className="hidden md:block text-text-2">해제 조건:</span>
                <div className="flex items-center gap-1 text-text-3">
                  {isTime ? <Clock size={16} /> : <MapPin size={16} />}
                  <span className="line-clamp-1">{unlockLabel}</span>
                </div>
              </div>

              <button
                type="button"
                className="md:flex-1 flex justify-end cursor-pointer text-primary"
                onClick={role === "ADMIN" ? onClose : close}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden">
            <div className="w-full h-full py-15 px-15">
              <div className="w-full h-full flex flex-col justify-between gap-8">
                {/* Dear */}
                <div className="text-2xl space-x-1">
                  <span className="text-primary font-bold">Dear.</span>
                  <span className="text-text-3">(수신자 정보 없음)</span>
                </div>

                {/* 본문 */}
                <div className="flex-1 mx-3 overflow-x-hidden overflow-y-auto">
                  <pre className="whitespace-pre-wrap wrap-break-word text-lg">
                    {capsule.content}
                  </pre>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="text-text-3">
                    {formatDate(capsule.createdAt)}
                  </span>

                  {/* From */}
                  <div className="text-2xl space-x-1">
                    <span className="text-primary font-bold">From.</span>
                    <span>{capsule.writerNickname}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {role === "USER" && (
            <div className="shrink-0 border-t p-5">
              <div className="flex-1 flex items-center justify-center">
                <div className="flex-1 flex items-center justify-center">
                  <button
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LinkIcon size={16} className="text-primary" />
                    <span>링크 복사</span>
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <Link
                    href={"/capsules/new"}
                    className="flex items-center justify-center gap-2"
                  >
                    <Reply size={16} className="text-primary" />
                    <span>답장하기</span>
                  </Link>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <button
                    type="button"
                    className="cursor-pointer flex items-center justify-center gap-2"
                  >
                    {mode ? (
                      <>
                        <Archive size={16} className="text-primary" />
                        <span>저장하기</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} className="text-primary" />
                        <span>북마크</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
