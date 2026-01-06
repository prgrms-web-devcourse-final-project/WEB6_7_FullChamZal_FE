import StorytrackCardSkeleton from "./StorytrackCardSkeleton";

export default function AllTrackPageSkeleton() {
  return (
    <>
      <div className="p-4 space-y-4 lg:p-8 lg:space-y-6 animate-pulse">
        <div className="space-y-3 flex-none">
          <div className="w-20 h-6 rounded-lg bg-outline"></div>
          <div className="space-y-2">
            <div className="w-50 h-7 lg:w-80 lg:h-9 rounded-lg bg-outline"></div>
            <div className="w-46 h-5 lg:w-70 lg:h-6 rounded-lg bg-outline"></div>
          </div>
        </div>

        {/* 검색 */}
        <div className="relative w-full h-15 rounded-lg bg-outline"></div>

        {/* 필터 영역 */}
        <div className="flex flex-wrap items-center justify-between ju gap-2 text-xs md:text-base">
          <div className="flex gap-2">
            <div className="w-15 h-10 rounded-lg bg-outline"></div>
            <div className="w-15 h-10 rounded-lg bg-outline"></div>
            <div className="w-15 h-10 rounded-lg bg-outline"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-10 rounded-lg bg-outline"></div>
            <div className="w-15 h-10 rounded-lg bg-outline"></div>
          </div>
        </div>

        <StorytrackCardSkeleton count={4} />
      </div>
    </>
  );
}
