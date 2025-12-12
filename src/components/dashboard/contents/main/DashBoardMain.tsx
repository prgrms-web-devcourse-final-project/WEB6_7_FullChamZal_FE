import TodayLetters from "./first/TodayLetters";
import QuickWrite from "./four/QuickWrite";
import PendingLetters from "./second/PendingLetters";
import ActivityStats from "./third/ActivityStats";

export default function DashBoardMain() {
  return (
    <>
      <div className="space-y-9">
        {/* 오늘 열람 가능한 편지 */}
        <TodayLetters />
        {/* 시작 인사 느낌 */}
        <PendingLetters />
        {/* 통계 */}
        <ActivityStats />
        {/* 빠른 편지 쓰기 */}
        <QuickWrite />
      </div>
    </>
  );
}
