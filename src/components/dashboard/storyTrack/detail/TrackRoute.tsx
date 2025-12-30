import Logo from "@/components/common/Logo";
import { Check, CheckCircle } from "lucide-react";

export default function TrackRoute() {
  return (
    <div className="h-full flex flex-col gap-4">
      <p className="text-base lg:text-xl">경로 상세</p>

      <div className="flex gap-4 lg:min-h-0">
        <div className="w-full h-full overflow-y-auto space-y-4 pr-2">
          {/* 순서대로 => 번호 / 순서x => 로고 */}
          {/* 순서 버전 */}
          <button className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 hover:bg-button-hover">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
              1
            </div>
            <div className="flex flex-col items-start">
              <p className="text-lg">잠실 한강공원</p>
              <p className="text-sm text-text-2">
                서울특별시 송파구 올림픽로 139
              </p>
            </div>
          </button>

          {/* 순서x 버전 */}
          <button className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 hover:bg-button-hover">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
              <Logo className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-lg">잠실 한강공원</p>
              <p className="text-sm text-text-2">
                서울특별시 송파구 올림픽로 139
              </p>
            </div>
          </button>

          {/* 편지 확인 버전 */}
          <button className="cursor-pointer w-full rounded-xl border border-green-400 p-6 flex items-start gap-4 bg-green-50">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-600 text-white">
              <CheckCircle />
            </div>
            <div className="space-y-2">
              <div className="flex flex-col items-start">
                <p className="text-lg">뚝섬 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 광진구 강변북로 139
                </p>
              </div>
              <p className="flex gap-1 text-xs text-green-600">
                <Check size={16} />
                <span>완료: 2024. 12. 21. 오전 10:15:00</span>
              </p>
            </div>
          </button>

          {/* 순서 버전에서 아직 차례가 되지 않은 것들 */}
          <button
            disabled
            className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 bg-button-hover disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
              3
            </div>
            <div className="flex flex-col items-start">
              <p className="text-lg">여의도 한강공원</p>
              <p className="text-sm text-text-2">
                서울특별시 영등포구 여의동로 330
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
