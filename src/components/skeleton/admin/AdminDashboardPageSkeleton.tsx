export default function AdminDashboardPageSkeleton() {
  return (
    <>
      <div className="w-full space-y-4 md:space-y-6 lg:space-y-8 animate-pulse">
        {/* Admin Header */}
        <div className="space-y-3">
          {/* Title */}
          <div className="lg:w-60 h-10 rounded-lg bg-gray-200"></div>
          {/* content */}
          <div className="lg:w-80 h-4 rounded-md bg-gray-200"></div>
        </div>

        {/* StatsOverview */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="w-full h-26 rounded-xl bg-gray-200"></div>
          <div className="w-full h-26 rounded-xl bg-gray-200"></div>
          <div className="w-full h-26 rounded-xl bg-gray-200"></div>
          <div className="w-full h-26 rounded-xl bg-gray-200"></div>
        </div>

        {/* Admin Body */}
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
          {/* Search */}
          <div className="w-full h-15 rounded-xl bg-gray-200"></div>

          {/* Menu Tab */}
          <ul className="flex gap-2 flex-wrap">
            <li className="w-20 h-11 rounded-xl bg-gray-200"></li>
            <li className="w-20 h-11 rounded-xl bg-gray-200"></li>
            <li className="w-20 h-11 rounded-xl bg-gray-200"></li>
            <li className="w-20 h-11 rounded-xl bg-gray-200"></li>
          </ul>

          {/* ContentsList */}
          <div className="space-y-3">
            {/* Table */}
            <div className="h-100 w-full rounded-xl bg-gray-200" />

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-center gap-2 text-sm">
              {/* 텍스트 스켈레톤 */}
              <span className="h-6 w-28 rounded-md bg-gray-200" />
              {/* 버튼 스켈레톤 */}
              <span className="h-8 w-14 rounded-lg bg-gray-200" />
              <span className="h-8 w-14 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
