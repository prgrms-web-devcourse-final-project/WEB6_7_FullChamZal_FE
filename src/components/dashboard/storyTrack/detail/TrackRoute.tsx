import Logo from "@/components/common/Logo";

export default function TrackRoute() {
  return (
    <div className="p-8 h-full flex flex-col gap-4">
      <p className="text-xl">경로 상세</p>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left - 편지들 (여기만 스크롤) */}
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {/* 순서대로 => 번호 / 순서x => 로고 */}
            {/* 순서 버전 */}
            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                1
              </div>
              <div>
                <p className="text-lg">잠실 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 송파구 올림픽로 139
                </p>
              </div>
            </div>

            {/* 순서x 버전 */}
            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                <Logo className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-lg">잠실 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 송파구 올림픽로 139
                </p>
              </div>
            </div>

            {/* 순서 버전 */}
            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                2
              </div>
              <div>
                <p className="text-lg">뚝섬 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 광진구 강변북로 139
                </p>
              </div>
            </div>

            {/* 순서x 버전 */}
            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                <Logo className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-lg">여의도 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 영등포구 여의동로 330
                </p>
              </div>
            </div>

            {/* 순서 버전 */}
            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                3
              </div>
              <div>
                <p className="text-lg">반포 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 서초구 신반포로11길 40
                </p>
              </div>
            </div>

            {/* 순서x 버전 */}
            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                <Logo className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-lg">망원 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 마포구 마포나루길 467
                </p>
              </div>
            </div>

            {/* 더미 카드들 */}
            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                4
              </div>
              <div>
                <p className="text-lg">잠원 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 서초구 잠원로 221
                </p>
              </div>
            </div>

            <div className="w-full rounded-xl border border-outline p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                <Logo className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-lg">이촌 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 용산구 이촌로72길 62
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - 지도 (고정) */}
        <div className="flex-1 rounded-lg border border-outline">지도 연결</div>
      </div>
    </div>
  );
}
