export default function TodayLettersSkeleton() {
  return (
    <>
      <div className="space-y-5 animate-pulse">
        {/* Text */}
        <div className="space-y-2">
          <div className="w-60 h-8 lg:w-80 lg:h-11 rounded-lg bg-gray-200"></div>
          <div className="w-80 h-5 lg:w-110 lg:h-7 rounded-lg bg-gray-200"></div>
        </div>
        {/* Card => 총 4개 까지 */}
        <div className=" flex gap-4 overflow-x-auto lg:grid lg:grid-cols-2 lg:overflow-visible lg:ml-6">
          <button className="snap-start min-w-[85%] sm:min-w-[70%] lg:min-w-0 h-45 rounded-lg bg-gray-200"></button>
          <button className="snap-start min-w-[85%] sm:min-w-[70%] lg:min-w-0 h-45 rounded-lg bg-gray-200"></button>
        </div>
      </div>
    </>
  );
}
