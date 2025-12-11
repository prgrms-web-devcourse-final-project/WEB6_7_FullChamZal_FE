"use client";

import { Heart, Inbox, MailPlus, Send } from "lucide-react";
import DivBox from "../DivBox";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyMailbox() {
  const pathname = usePathname();

  const isSend = pathname.startsWith("/dashboard/send");
  const isReceive = pathname.startsWith("/dashboard/receive");
  const isBookmark = pathname.startsWith("/dashboard/bookmark");

  const baseBoxClass = "px-5 py-3 rounded-[10px]";
  const activeBoxClass =
    "bg-primary-2 border-primary-2/0 text-white shadow-md hover:bg-primary-2";

  return (
    <div className="space-y-3">
      <p className="font-medium">나의 우체통</p>
      <div className="space-y-4">
        {/* 편지 쓰기 */}
        <Link href="/capsules/new" className="block">
          <DivBox className="py-2 rounded-[10px]">
            <div className="flex items-center justify-center gap-2">
              <MailPlus size={20} />
              <span>편지 쓰기</span>
            </div>
          </DivBox>
        </Link>

        {/* 보낸 편지 */}
        <Link href="/dashboard/send" className="block">
          <DivBox className={`${baseBoxClass} ${isSend ? activeBoxClass : ""}`}>
            <div className="flex items-center gap-6">
              <Send className={isSend ? "text-white" : "text-primary"} />
              <div className="flex flex-col gap-1">
                <span
                  className={`text-sm ${isSend ? "text-white" : "text-text-3"}`}
                >
                  보낸 편지
                </span>
                <span className="text-2xl">24</span>
              </div>
            </div>
          </DivBox>
        </Link>

        {/* 받은 편지 */}
        <Link href="/dashboard/receive" className="block">
          <DivBox
            className={`${baseBoxClass} ${isReceive ? activeBoxClass : ""}`}
          >
            <div className="flex items-center gap-6">
              <Inbox className={isReceive ? "text-white" : "text-primary"} />
              <div className="flex flex-col gap-1">
                <span
                  className={`text-sm ${
                    isReceive ? "text-white" : "text-text-3"
                  }`}
                >
                  받은 편지
                </span>
                <span className="text-2xl">12</span>
              </div>
            </div>
          </DivBox>
        </Link>

        {/* 즐겨찾기 */}
        <Link href="/dashboard/bookmark" className="block">
          <DivBox
            className={`${baseBoxClass} ${isBookmark ? activeBoxClass : ""}`}
          >
            <div className="flex items-center gap-6">
              <Heart className={isBookmark ? "text-white" : "text-primary"} />
              <div className="flex flex-col gap-1">
                <span
                  className={`text-sm ${
                    isBookmark ? "text-white" : "text-text-3"
                  }`}
                >
                  즐겨찾기
                </span>
                <span className="text-2xl">12</span>
              </div>
            </div>
          </DivBox>
        </Link>
      </div>
    </div>
  );
}
