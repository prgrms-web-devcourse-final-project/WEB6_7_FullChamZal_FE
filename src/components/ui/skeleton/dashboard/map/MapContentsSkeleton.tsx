export default function MapContentsSkeleton() {
  return (
    <>
      <div className="w-full h-full p-4 lg:p-8">
        <div className="h-full flex flex-col gap-2 lg:gap-4 animate-pulse">
          {/* 헤더 */}
          <div className="space-y-1 lg:space-y-2">
            <div className="w-50 h-7 lg:w-60 lg:h-9 rounded-lg bg-outline"></div>
            <div className="w-70 h-5 lg:w-80 lg:h-6 rounded-lg bg-outline"></div>
          </div>

          {/* 지도 + 리스트 영역 */}
          <div className="flex-1 flex lg:flex-row flex-col gap-4 min-h-0">
            {/* 지도 */}
            <div className="flex-3 min-h-0 rounded-xl bg-outline"></div>
            <div className="flex-1 min-h-0 rounded-xl bg-outline"></div>
          </div>
        </div>
      </div>
    </>
  );
}
