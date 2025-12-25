import { ListOrdered, MapPin, Users } from "lucide-react";

export default function MineCard() {
  return (
    <>
      <div className="border border-outline rounded-xl">
        {/* Top */}
        <div className="relative">
          {/* 이미지로 변경 */}
          <div className="w-full h-40 bg-amber-300 rounded-t-xl"></div>
          {/* 순서o or 순서x */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-2 rounded-lg text-white bg-green-600 text-sm">
            <ListOrdered size={18} />
            <span>순서대로</span>
            {/* <Shuffle size={18} />
            <span>순서 무관</span> */}
          </div>
        </div>
        {/* Bottom */}
        <div className="p-6 space-y-4">
          {/* 제목과 소개 */}
          <div className="space-y-1">
            <p>성수동 카페투어</p>
            <p className="text-sm text-text-3 line-clamp-2 break-keep">
              힙한 성수동의 숨은 카페들을 찾아가는 여정. 각 카페마다 특별한
              이야기가 담겨있습니다.
            </p>
          </div>

          {/* 아이콘 요약 */}
          <div className="text-text-3 text-xs flex items-center gap-3">
            <div className="flex gap-1 items-center">
              <MapPin size={16} />
              5개 장소
            </div>
            <div className="flex gap-1 items-center">
              <Users size={16} />
              123명
            </div>
          </div>

          {/* 생성일 */}
          <div className="text-xs text-text-3">생성일: 2024. 12. 15.</div>
        </div>
      </div>
    </>
  );
}
