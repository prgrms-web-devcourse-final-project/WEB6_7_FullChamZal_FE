export default function StorytrackCardSkeleton({
  count = 12,
}: {
  count?: number;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-outline bg-white space-y-3"
          >
            <div className="h-36 rounded-t-2xl bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-2/3 rounded-md bg-gray-200" />
              <div className="h-4 w-1/2 rounded-md bg-gray-200" />
              <div className="h-16 w-full rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
