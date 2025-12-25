"use client";

import Button from "@/components/common/Button";
import { Compass, Map, Plus, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function StoryMenuTab() {
  const pathname = usePathname();
  const router = useRouter();

  const isJoined = pathname.includes("/joined");
  const isMine = pathname.includes("/mine");

  const baseBtn = "border md:font-normal px-5 py-3 gap-1 text-sm";

  const activeBtn =
    "bg-button-hover border-primary-2 text-primary-2 hover:bg-button-hover";

  const inactiveBtn = "bg-white border-outline text-text hover:bg-button-hover";

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        {/* 왼쪽 */}
        <div className="space-x-6">
          <Button
            onClick={() => router.push("/dashboard/storyTrack/joined")}
            className={`${baseBtn} ${isJoined ? activeBtn : inactiveBtn}`}
          >
            <Users size={18} />
            참여 중인 트랙
          </Button>

          <Button
            onClick={() => router.push("/dashboard/storyTrack/mine")}
            className={`${baseBtn} ${isMine ? activeBtn : inactiveBtn}`}
          >
            <Map size={18} />
            내가 만든 트랙
          </Button>
        </div>
        {/* 오른쪽 */}
        <div className="space-x-6">
          <Button
            onClick={() => router.push("/dashboard/storyTrack/all")}
            className="bg-white border border-outline text-text md:font-normal px-5 py-3 gap-1 text-sm hover:bg-button-hover"
          >
            <Compass size={18} />
            전체 트랙 보기
          </Button>
          <Button
            onClick={() => router.push("/dashboard/storyTrack/new")}
            className="bg-primary-2 hover:bg-primary-3 md:font-normal px-5 py-3 gap-1 text-sm"
          >
            <Plus size={18} />새 트랙 만들기
          </Button>
        </div>
      </div>
    </>
  );
}
