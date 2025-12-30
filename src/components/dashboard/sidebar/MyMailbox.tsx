"use client";

import { Heart, Inbox, MailPlus, Send } from "lucide-react";
import DivBox from "../DivBox";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { useQuery } from "@tanstack/react-query";

export default function MyMailbox({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isSend = pathname.startsWith("/dashboard/send");
  const isReceive = pathname.startsWith("/dashboard/receive");
  const isBookmark = pathname.startsWith("/dashboard/bookmark");

  const baseBoxClass = "py-2 px-5 lg:py-3 rounded-[10px]";
  const activeBoxClass =
    "bg-primary-2 border-primary-2/0 text-white shadow-md hover:bg-primary-2";

  /** 보낸 편지 */
  const { data: sendData } = useQuery({
    queryKey: ["capsuleDashboard", "send", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.sendDashboard({ page: 0, size: 1 }, signal),
  });

  /** 받은 편지 */
  const { data: receiveData } = useQuery({
    queryKey: ["capsuleDashboard", "receive", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.receiveDashboard({ page: 0, size: 1 }, signal),
  });

  /* 북마크 */
  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmarks", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.bookmarks({ page: 0, size: 1 }, signal),
  });

  const sendCount = sendData?.data.totalElements ?? 0;
  const receiveCount = receiveData?.data.totalElements ?? 0;
  const bookmarkCount = bookmarkData?.totalElements ?? 0;

  return (
    <div className="space-y-3">
      <p className="font-medium">나의 우체통</p>
      <div className="space-y-4">
        {/* 편지 쓰기 */}
        <Link href="/capsules/new" className="block" onClick={onNavigate}>
          <DivBox className="py-2 rounded-[10px]">
            <div className="flex items-center justify-center gap-2">
              <MailPlus size={20} />
              <span>편지 쓰기</span>
            </div>
          </DivBox>
        </Link>

        {/* 보낸 편지 */}
        <Link href="/dashboard/send" className="block" onClick={onNavigate}>
          <DivBox className={`${baseBoxClass} ${isSend ? activeBoxClass : ""}`}>
            <div className="flex items-center gap-6">
              <Send className={isSend ? "text-white" : "text-primary"} />
              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs lg:text-sm ${
                    isSend ? "text-white" : "text-text-3"
                  }`}
                >
                  보낸 편지
                </span>
                <span className="text-lg lg:text-2xl">{sendCount}</span>
              </div>
            </div>
          </DivBox>
        </Link>

        {/* 받은 편지 */}
        <Link href="/dashboard/receive" className="block" onClick={onNavigate}>
          <DivBox
            className={`${baseBoxClass} ${isReceive ? activeBoxClass : ""}`}
          >
            <div className="flex items-center gap-6">
              <Inbox className={isReceive ? "text-white" : "text-primary"} />
              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs lg:text-sm ${
                    isReceive ? "text-white" : "text-text-3"
                  }`}
                >
                  받은 편지
                </span>
                <span className="text-lg lg:text-2xl">{receiveCount}</span>
              </div>
            </div>
          </DivBox>
        </Link>

        {/* 즐겨찾기 */}
        <Link href="/dashboard/bookmark" className="block" onClick={onNavigate}>
          <DivBox
            className={`${baseBoxClass} ${isBookmark ? activeBoxClass : ""}`}
          >
            <div className="flex items-center gap-6">
              <Heart className={isBookmark ? "text-white" : "text-primary"} />
              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs lg:text-sm ${
                    isBookmark ? "text-white" : "text-text-3"
                  }`}
                >
                  소중한 편지
                </span>
                <span className="text-lg lg:text-2xl">{bookmarkCount}</span>
              </div>
            </div>
          </DivBox>
        </Link>
      </div>
    </div>
  );
}
