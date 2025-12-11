import { ArrowRight } from "lucide-react";
import DivBox from "../../DivBox";

export default function TodayLetters() {
  return (
    <>
      <div className="space-y-5">
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-4xl font-medium">
            안녕하세요, 홍길동님
            <span className="text-primary px-1">_</span>
          </h2>
          <p className="text-text-2 text-lg ">
            오늘은 12월 5일, 오늘 당신을 기다리는 편지가{" "}
            <span className="text-primary font-semibold">4통</span> 있습니다.
          </p>
        </div>
        {/* Card => 총 4개 까지 */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:ml-6">
          <DivBox className="w-full">
            <div className="space-y-3">
              <div className="flex justify-between">
                {/* 보낸 사람 */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-3 text-xs">보낸 사람</span>
                  <span>김민수</span>
                </div>

                {/* 해제 조건에 따라 아이콘 변경 */}
                <div>
                  <span className="px-3 py-2 rounded-md bg-sub text-sm">
                    오늘 오후 2시
                  </span>
                </div>
              </div>
              {/* 해제 조건 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-3 text-xs">해제 조건</span>
                <span>2024년 12월 5일 오전 9시</span>
              </div>
              {/* D-Day or 거리 */}
              <div className="flex items-center gap-1 text-text-3">
                <span className="text-sm ">편지 읽기</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </DivBox>
          <DivBox className="w-full">
            <div className="space-y-3">
              <div className="flex justify-between">
                {/* 보낸 사람 */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-3 text-xs">보낸 사람</span>
                  <span>김민수</span>
                </div>

                {/* 해제 조건에 따라 아이콘 변경 */}
                <div>
                  <span className="px-3 py-2 rounded-md bg-sub text-sm">
                    오늘 오후 2시
                  </span>
                </div>
              </div>
              {/* 해제 조건 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-3 text-xs">해제 조건</span>
                <span>2024년 12월 5일 오전 9시</span>
              </div>
              {/* D-Day or 거리 */}
              <div className="flex items-center gap-1 text-text-3">
                <span className="text-sm ">편지 읽기</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </DivBox>
          <DivBox className="w-full">
            <div className="space-y-3">
              <div className="flex justify-between">
                {/* 보낸 사람 */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-3 text-xs">보낸 사람</span>
                  <span>김민수</span>
                </div>

                {/* 해제 조건에 따라 아이콘 변경 */}
                <div>
                  <span className="px-3 py-2 rounded-md bg-sub text-sm">
                    오늘 오후 2시
                  </span>
                </div>
              </div>
              {/* 해제 조건 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-3 text-xs">해제 조건</span>
                <span>2024년 12월 5일 오전 9시</span>
              </div>
              {/* D-Day or 거리 */}
              <div className="flex items-center gap-1 text-text-3">
                <span className="text-sm ">편지 읽기</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </DivBox>
        </div>
      </div>
    </>
  );
}
