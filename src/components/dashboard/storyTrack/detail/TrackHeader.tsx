import { ListOrdered, MapPin, Users } from "lucide-react";
import Image from "next/image";

export default function TrackHeader() {
  return (
    <div className="relative w-full pt-20 pb-8 px-8 rounded-t-2xl overflow-hidden">
      <Image
        src=""
        alt="대표 이미지"
        fill
        className="object-cover bg-amber-200 z-0"
      />

      <div className="absolute inset-0 bg-black/30 z-10" />

      <div className="relative z-20 space-y-4">
        <h4 className="text-3xl text-white font-semibold">서울 한강 이야기</h4>

        <div className="text-white text-sm flex gap-3">
          <div className="flex gap-1 items-center">
            <ListOrdered size={16} />
            순서대로
          </div>
          <div className="flex gap-1 items-center">
            <MapPin size={16} />
            5개 장소
          </div>
          <div className="flex gap-1 items-center">
            <Users size={16} />
            123명 참여 중
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 p-3 rounded-lg bg-white/20">
          <div className="flex justify-between text-xs text-white">
            <span>진행 상황</span>
            <span>2 / 5 완료</span>
          </div>
          <div className="relative w-full h-2 bg-button-hover rounded-full overflow-hidden">
            <div className="absolute inset-0 w-[40%] bg-primary-2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
