import { Flag } from "lucide-react";

export default function TrackProgress() {
  return (
    <>
      <div className="p-8 h-full flex flex-col gap-4">
        <p className="flex-none text-xl">내 진행 상황</p>

        <div className="flex-1 min-h-0 flex flex-col gap-6">
          {/* 내가 완료한 장소 / 남은 장소 / 진행률 */}
          <div className="flex gap-8">
            <div className="flex-1 flex flex-col gap-2 p-6 border border-outline rounded-xl">
              <span className="text-sm text-text-3">완료한 장소</span>
              <span className="text-2xl">2</span>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-6 border border-outline rounded-xl">
              <span className="text-sm text-text-3">남은 장소</span>
              <span className="text-2xl">3</span>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-6 border border-outline rounded-xl">
              <span className="text-sm text-text-3">진행률</span>
              <span className="text-2xl">40%</span>
            </div>
          </div>

          {/* 다음 목적지 */}
          <div className="flex flex-col gap-4 p-6 border border-outline rounded-xl">
            <div className="flex items-center gap-2">
              <Flag className="text-primary" />
              <span className="text-lg">다음 목적지</span>
            </div>
            <div className="space-y-2">
              <p className="text-xl">잠심 한강 공원</p>
              <p className="text-text-3 text-sm">
                서울특별시 송파구 올림픽로 139
              </p>
            </div>
          </div>

          {/* 시작일 / 최근 방문일 */}
          <div className="flex gap-8">
            <div className="flex-1 flex flex-col gap-2 p-6 border border-outline rounded-xl">
              <span className="text-sm text-text-3">시작일</span>
              <span>2025. 12. 20.</span>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-6 border border-outline rounded-xl">
              <span className="text-sm text-text-3">최근 방문</span>
              <span>2025. 12. 21.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
