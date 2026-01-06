export default function StorytrackHeaderSkeleton() {
  return (
    <>
      {/* Header */}
      <div className="space-y-1 lg:space-y-2">
        <div className="w-50 h-7 lg:w-60 lg:h-9 rounded-lg bg-outline"></div>
        <div className="w-70 h-5 lg:w-80 lg:h-6 rounded-lg bg-outline"></div>
      </div>

      {/* Menu Tab */}
      <div className="flex flex-row justify-between md:items-center gap-4">
        {/* 왼쪽 */}
        <div className="flex gap-2 md:gap-6">
          <div className="w-36 h-12 rounded-lg bg-outline"></div>
          <div className="w-36 h-12 rounded-lg bg-outline"></div>
        </div>

        {/* 오른쪽 */}
        <div className="flex gap-2 md:gap-6">
          <div className="w-36 h-12 rounded-lg bg-outline"></div>
          <div className="w-36 h-12 rounded-lg bg-outline"></div>
        </div>
      </div>
    </>
  );
}
