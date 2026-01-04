export default function LetterReadingSkeleton() {
  return (
    <>
      <div className="flex flex-col justify-between w-full border p-6 border-outline rounded-2xl lg:flex-1 animate-pulse">
        {/* Header */}
        <div className="w-26 h-7 rounded-lg bg-gray-200"></div>

        {/* PieChart */}
        <div className="flex flex-col items-center gap-12">
          <div className="w-60 h-60 rounded-full bg-gray-200"></div>
          <div className="flex gap-2">
            <div className="w-15 h-6 rounded-lg bg-gray-200"></div>
            <div className="w-15 h-6 rounded-lg bg-gray-200"></div>
          </div>
        </div>

        {/* Count */}
        <div className="space-y-4">
          <div className="w-full h-10 rounded-lg bg-gray-200"></div>
          <div className="w-full h-10 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    </>
  );
}
