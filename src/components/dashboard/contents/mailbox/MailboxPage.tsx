"use client";

import { useMemo } from "react";
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
    send: { title: "보낸 편지", icon: <Send /> },
    receive: { title: "받은 편지", icon: <Inbox /> },
    bookmark: { title: "소중한 편지", icon: <Bookmark /> },
  }[type];

  const isBookmark = type === "bookmark";

  // bookmark면 BookmarkPageResponse, 아니면 CapsuleDashboardItem[]
  const { data, isLoading, error } = useQuery<
    CapsuleDashboardItem[] | BookmarkPageResponse
  >({
    queryKey: isBookmark
      ? ["bookmarks", { page: 0, size: 24 }]
      : ["capsuleDashboard", type],
    queryFn: ({ signal }) => {
      if (type === "send") return capsuleDashboardApi.sendDashboard(signal);
      if (type === "receive")
        return capsuleDashboardApi.receiveDashboard(signal);

      return capsuleDashboardApi.bookmarks(
        { page: 0, size: 24, sort: ["bookmarkedAt,desc"] },
        signal
      );
    },
  });

  // 렌더에 쓸 "리스트"와 "총개수"를 통일된 형태로 뽑아내기
  const { list, totalCount } = useMemo(() => {
    if (!data) return { list: [] as CapsuleDashboardItem[], totalCount: 0 };

    if (isBookmark) {
      const page = data as BookmarkPageResponse;

      const adapted: CapsuleDashboardItem[] = page.content.map((b) => ({
        capsuleId: b.capsuleId,
        sender: b.sender,
        title: b.title,
        content: b.contentPreview,
        createAt: b.bookmarkedAt,
        viewStatus: b.isViewed,
      }));

      return { list: adapted, totalCount: page.totalElements };
    }

    const arr = data as CapsuleDashboardItem[];
    return { list: arr, totalCount: arr.length };
  }, [data, isBookmark]);

  if (isLoading) return <MailboxSkeleton />;
  if (error) return <div>에러 발생</div>;

  return (
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
                  {totalCount}통
                </span>
                의 편지
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            {!list.length ? (
              <p>
                {isBookmark ? "북마크한 편지가 없습니다" : "편지가 없습니다"}
              </p>
            ) : (
              list.map((capsule) => (
                <EnvelopeCard
                  key={capsule.capsuleId}
                  capsule={capsule}
                  type={type}
                />
              ))
            )}
          </div>
        </DivBox>
      </div>
    </section>
  );
}
