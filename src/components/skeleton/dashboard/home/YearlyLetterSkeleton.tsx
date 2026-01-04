export default function YearlyLetterSkeleton() {
  return (
    <>
      <div className="w-full border p-6 border-outline rounded-2xl lg:flex-2 space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          {/* Title */}
          <div className="space-y-1">
            <div className="w-26 h-7 rounded-lg bg-gray-200"></div>
            <div className="w-30 h-6 rounded-lg bg-gray-200"></div>
          </div>

          <div className="flex items-center gap-4">
            {/* 연도별 활동 확인 버튼 */}
            <div className="w-33 h-10 rounded-full bg-gray-200"></div>

            {/* 활동 뱃지 */}
            <div className="w-11 h-5 rounded-lg bg-gray-200"></div>
          </div>
        </div>

        {/* Count */}
        <div className="flex gap-4">
          <div className="w-full lg:h-21 rounded-[10px] bg-gray-200"></div>
          <div className="w-full lg:h-21 rounded-[10px] bg-gray-200"></div>
        </div>

        {/* 차트 */}
        <div className="w-full h-60 md:h-75 lg:h-80 rounded-lg bg-gray-200"></div>
      </div>
    </>
  );
}
