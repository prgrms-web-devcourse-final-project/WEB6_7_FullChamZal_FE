import { MapPin } from "lucide-react";

export default function Card() {
  return (
    <>
      <div className="border border-outline rounded-xl p-4 space-y-4">
        <div className="space-y-1">
          <p>서울의 봄날</p>
          <div className="text-xs flex items-center gap-1 text-text-3">
            <div className="flex items-center gap-1">
              <MapPin size={12} /> <span>서울시청</span>
            </div>
            <span>•</span> <span>500m</span>
          </div>
        </div>
        <div className="text-sm">
          <p>벚꽃이 피는 이 거리에서 당신을 떠올립니다...</p>
        </div>
        <div className="flex justify-between text-xs text-text-2">
          <span>by 익명의 여행자</span> <span>2024.03.15</span>
        </div>
      </div>
    </>
  );
}
