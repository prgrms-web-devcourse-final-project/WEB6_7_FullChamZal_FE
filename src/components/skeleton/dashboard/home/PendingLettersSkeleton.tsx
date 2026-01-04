export default function PendingLettersSkeleton() {
  return (
    <>
      <div className="space-y-5 animate-pulse">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-200"></div>
          <div className="space-y-1">
            <div className="w-20 h-7 rounded-lg bg-gray-200"></div>
            <div className="w-50 h-5 rounded-lg bg-gray-200"></div>
          </div>
        </div>

        {/* Contents */}
        <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4 lg:ml-6">
          <div className="w-full h-45 rounded-2xl bg-gray-200 min-w-[85%] sm:min-w-[70%] lg:min-w-0"></div>
          <div className="w-full h-45 rounded-2xl bg-gray-200 min-w-[85%] sm:min-w-[70%] lg:min-w-0"></div>
        </div>
      </div>
    </>
  );
}
