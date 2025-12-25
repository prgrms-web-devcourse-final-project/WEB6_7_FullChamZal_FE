import Button from "@/components/common/Button";
import { ListOrdered, MapPin, Users } from "lucide-react";

export default function TrackCard() {
  return (
    <>
      <div className="border border-outline rounded-xl">
        {/* Top */}
        <div className="relative">
          {/* 이미지로 변경 */}
          <div className="w-full h-40 bg-amber-300 rounded-t-xl"></div>
        </div>
        {/* Bottom */}
        <div className="p-6 space-y-4">
          {/* 제목과 소개 */}
          <div className="space-y-1">
            <p>서울 야경 투어</p>
            <p className="text-sm text-text-3 line-clamp-2 break-keep">
              서울의 아름다운 야경 명소를 찾아가는 로맨틱한 여정. N서울타워부터
              한강까지
            </p>
          </div>

          {/* 작성자 프로필 */}
          <div className="flex items-center gap-1.5">
            <div className="flex-none w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">
              {/* 그 사람의 프로필 */}홍
            </div>
            <p className="text-xs text-text-2">홍길동</p>
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
          <Button className="md:font-normal gap-1 w-full py-3">
            <Users size={20} />
            참여하기
            {/* 참여 중인 리스트는 참여 중이라고 나오고 버튼 클릭 못하도록! */}
          </Button>
        </div>
      </div>
    </>
  );
}
