import { Clock } from "lucide-react";
import DivBox from "../DivBox";

export default function DashboardContents() {
  return (
    <>
      <div className="flex-1 h-full overflow-y-auto p-8">
        <div>
          {/* 시작 인사 느낌 */}
          <div className="space-y-5">
            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-4xl font-medium">
                안녕하세요, 홍길동님
                <span className="text-primary px-1">_</span>
              </h2>
              <p className="text-text-2 text-lg ">
                오늘은 12월 5일, 당신을 기다리는 편지가{" "}
                <span className="text-primary font-semibold">3통</span>{" "}
                있습니다.
              </p>
            </div>
            {/* Card => 총 4개 까지 */}
            <div className="flex gap-4">
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
          {/* 오늘 열람 가능한 편지 */}
          <div></div>
          {/* 통계 */}
          <div></div>
          {/* 빠른 편지 쓰기 */}
          <div></div>
        </div>
      </div>
    </>
  );
}
