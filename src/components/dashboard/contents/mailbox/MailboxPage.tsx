"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import DivBox from "../../DivBox";
import EnvelopeCard from "./EnvelopeCard";
import { Bookmark, Inbox, Send } from "lucide-react";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import MailboxSkeleton from "@/components/skeleton/MailboxSkeleton";

export default function MailboxPage({
  type,
}: {
  type: "send" | "receive" | "bookmark";
}) {
  const config = {
    send: {
      title: "보낸 편지",
      icon: <Send />,
    },
    receive: {
      title: "받은 편지",
      icon: <Inbox />,
    },
    bookmark: {
      title: "저장한 편지",
      icon: <Bookmark />,
    },
  }[type];

  const isBookmark = type === "bookmark";

  const { data, isLoading, error } = useQuery({
    queryKey: ["capsuleDashboard", type],
    queryFn: ({ signal }) => {
      if (type === "send") return capsuleDashboardApi.sendDashboard(signal);
      if (type === "receive")
        return capsuleDashboardApi.receiveDashboard(signal);
      // bookmark는 호출 안 함
      return Promise.resolve([] as any[]);
    },
    enabled: !isBookmark, // bookmark는 일단 제외
  });

  if (isBookmark) {
    return <div>북마크는 준비중!</div>;
  }

  if (isLoading) return <MailboxSkeleton />;
  if (error) return <div>에러 발생</div>;

  return (
    <>
      <section className="flex-1 w-full">
        <div className="p-8">
          <DivBox className="cursor-auto hover:bg-white space-y-12">
            <div className="flex items-center gap-4">
              <div className="text-primary">{config.icon}</div>
              <div>
                <p className="text-lg">
                  {config.title}
                  <span className="text-primary px-1">_</span>
                </p>
                <p className="text-sm text-text-3">
                  <span className="text-primary font-semibold">
                    {data?.length ? data?.length : 0}통
                  </span>
                  의 편지
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between">
              {!data?.length ? (
                <p>받은 편지가 없습니다</p>
              ) : (
                <>
                  {/* 편지 */}
                  {data.map((capsule) => (
                    <EnvelopeCard
                      key={capsule.capsuleId}
                      capsule={capsule}
                      type={type}
                    />
                  ))}
                </>
              )}
            </div>
          </DivBox>
        </div>
      </section>
    </>
  );
}
