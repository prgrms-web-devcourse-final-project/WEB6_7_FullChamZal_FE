"use client";

import Button from "@/components/common/Button";
import { ListOrdered, MapPin, Play, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JoinedCard() {
  const router = useRouter();
  return (
    <>
      <div className="border border-outline rounded-xl">
        {/* Top */}
        <div className="relative">
          {/* 이미지로 변경 */}
          <div className="w-full h-40 bg-amber-300 rounded-t-xl"></div>
          {/* 달성도 */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-2 rounded-lg text-white bg-primary-3 text-sm">
            <TrendingUp size={18} />
            <span>40% 완료</span>
          </div>
        </div>
        {/* Bottom */}
        <div className="p-6 space-y-4">
          {/* 제목과 소개 */}
          <div className="space-y-1">
            <p>서울 한강 이야기</p>
            <p className="text-sm text-text-3 line-clamp-2 break-keep">
              한강을 따라 펼쳐지는 추억의 여정. 여의도부터 뚝섬까지, 각 장소마다
              숨겨진 이야기를 발견하세요.
            </p>
          </div>

          {/* 작성자 프로필 */}
          <div className="flex items-center gap-1.5">
            <div className="flex-none w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">
              {/* 그 사람의 프로필 */}홍
            </div>
            <p className="text-xs text-text-2">홍길동</p>
          </div>

          {/* 진행 상황 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-text-3">
              <span>진행 상황</span>
              <span>2 / 5 완료</span>
            </div>
            <div>
              <div className="relative w-full h-2 bg-button-hover rounded-full overflow-hidden">
                <div className="absolute inset-0 w-[calc(100%/5*2)] bg-primary-2 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 아이콘 요약 */}
          <div className="text-text-3 text-xs flex items-center gap-3">
            <div className="flex gap-1 items-center">
              <ListOrdered size={16} />
              순서대로
              {/* <Shuffle size={18} />
            <span>순서 무관</span> */}
            </div>
            <div className="flex gap-1 items-center">
              <MapPin size={16} />
              5개 장소
            </div>
            <div className="flex gap-1 items-center">
              <Users size={16} />
              123명
            </div>
          </div>

          {/* 버튼 */}
          <Button
            onClick={() => router.push("/dashboard/storyTrack/1")}
            className="md:font-normal gap-1 w-full py-3"
          >
            <Play size={20} />
            계속하기
          </Button>
        </div>
      </div>
    </>
  );
}
