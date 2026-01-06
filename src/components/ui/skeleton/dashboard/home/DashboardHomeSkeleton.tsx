import LetterReadingSkeleton from "./LetterReadingSkeleton";
import PendingLettersSkeleton from "./PendingLettersSkeleton";
import TodayLettersSkeleton from "./TodayLettersSkeleton";
import YearlyLetterSkeleton from "./YearlyLetterSkeleton";

export default function DashboardHomeSkeleton() {
  return (
    <>
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-9">
        {/* 오늘 열람 가능한 편지 */}
        <TodayLettersSkeleton />

        {/* 미열람 편지 */}
        <PendingLettersSkeleton />

        {/* 통계 */}
        <div className="flex flex-col lg:flex-row gap-6">
          <YearlyLetterSkeleton />
          <LetterReadingSkeleton />
        </div>
      </div>
    </>
  );
}
