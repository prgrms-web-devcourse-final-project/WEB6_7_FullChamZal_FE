"use client";

import Button from "@/components/common/Button";
import { Map, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function StoryMenuTab() {
  const pathname = usePathname();
  const router = useRouter();

  const isJoined = pathname.includes("/joined");
  const isMine = pathname.includes("/mine");

  const baseBtn =
    "border-2 md:font-normal px-4 py-3 md:px-5 gap-1 text-sm flex items-center justify-center";

  const activeBtn = "bg-bg border-primary-2 text-primary-2 hover:bg-bg";
  const inactiveBtn = "bg-bg border-outline text-text hover:bg-button-hover";

  // 모바일: 선택된 탭만 텍스트 노출, 나머지는 아이콘만
  const labelClass = (active: boolean) =>
    active ? "inline md:inline" : "hidden md:inline";

  return (
    <div className="flex flex-row justify-between md:items-center gap-4">
      {/* 왼쪽 */}
      <div className="flex gap-2 md:gap-6">
        <Button
          onClick={() => router.push("/dashboard/storyTrack/joined")}
          className={`${baseBtn} ${isJoined ? activeBtn : inactiveBtn}`}
          aria-label="참여 중인 트랙"
          title="참여 중인 트랙"
        >
          <Users size={18} />
          <span className={labelClass(isJoined)}>참여 중인 트랙</span>
        </Button>

        <Button
          onClick={() => router.push("/dashboard/storyTrack/mine")}
          className={`${baseBtn} ${isMine ? activeBtn : inactiveBtn}`}
          aria-label="내가 만든 트랙"
          title="내가 만든 트랙"
        >
          <Map size={18} />
          <span className={labelClass(isMine)}>내가 만든 트랙</span>
        </Button>
      </div>
    </div>
  );
}
