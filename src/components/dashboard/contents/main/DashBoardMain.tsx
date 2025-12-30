import TodayLetters from "./first/TodayLetters";
import QuickWrite from "./four/QuickWrite";
import PendingLetters from "./second/PendingLetters";
import ActivityStats from "./third/ActivityStats";

export default function DashBoardMain() {
  return (
    <>
      <div className="space-y-6 lg:space-y-9">
        {/* 오늘 열람 가능한 편지 */}
        <TodayLetters />
        {/* 미열람 편지 */}
        <PendingLetters />
        {/* 통계 */}
        <ActivityStats />
        {/* 빠른 편지 쓰기 */}
        <QuickWrite />
      </div>
    </>
  );
}
