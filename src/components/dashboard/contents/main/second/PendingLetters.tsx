import { Clock, Sparkle } from "lucide-react";
import DivBox from "../../../DivBox";

export default function PendingLetters() {
  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <Sparkle className="text-primary" />
          <div>
            <p className="text-lg">미열람 편지</p>
            <p className="text-sm text-text-3">
              아직 열리지 않은 편지가{" "}
              <span className="text-primary font-semibold">4통</span> 있습니다.
            </p>
          </div>
        </div>
        {/* Card => 총 4개 까지, lg:4개 */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:ml-6">
          <DivBox>
            <div className="space-y-3">
              <div className="flex justify-between">
                {/* 보낸 사람 */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-3 text-xs">보낸 사람</span>
                  <span>김민수</span>
                </div>

                {/* 해제 조건에 따라 아이콘 변경 */}
                <div>
                  <Clock size={18} />
                </div>
              </div>
              {/* 해제 조건 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-3 text-xs">해제 조건</span>
                <span>2024년 12월 25일 오전 9시</span>
              </div>
              {/* D-Day or 거리 */}
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">D-21</span>
              </div>
            </div>
          </DivBox>
          <DivBox>
            <div className="space-y-3">
              <div className="flex justify-between">
                {/* 보낸 사람 */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-3 text-xs">보낸 사람</span>
                  <span>김민수</span>
                </div>

                {/* 해제 조건에 따라 아이콘 변경 */}
                <div>
                  <Clock size={18} />
                </div>
              </div>
              {/* 해제 조건 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-3 text-xs">해제 조건</span>
                <span>2024년 12월 25일 오전 9시</span>
              </div>
              {/* D-Day or 거리 */}
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">D-21</span>
              </div>
            </div>
          </DivBox>
          <DivBox>
            <div className="space-y-3">
              <div className="flex justify-between">
                {/* 보낸 사람 */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-3 text-xs">보낸 사람</span>
                  <span>김민수</span>
                </div>

                {/* 해제 조건에 따라 아이콘 변경 */}
                <div>
                  <Clock size={18} />
                </div>
              </div>
              {/* 해제 조건 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-3 text-xs">해제 조건</span>
                <span>2024년 12월 25일 오전 9시</span>
              </div>
              {/* D-Day or 거리 */}
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">D-21</span>
              </div>
            </div>
          </DivBox>
          <DivBox>
            <div className="space-y-3">
              <div className="flex justify-between">
                {/* 보낸 사람 */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-3 text-xs">보낸 사람</span>
                  <span>김민수</span>
                </div>

                {/* 해제 조건에 따라 아이콘 변경 */}
                <div>
                  <Clock size={18} />
                </div>
              </div>
              {/* 해제 조건 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-3 text-xs">해제 조건</span>
                <span>2024년 12월 25일 오전 9시</span>
              </div>
              {/* D-Day or 거리 */}
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">D-21</span>
              </div>
            </div>
          </DivBox>
        </div>
      </div>
    </>
  );
}
