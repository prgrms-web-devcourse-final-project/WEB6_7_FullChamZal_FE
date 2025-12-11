import PendingLetters from "./second/PendingLetters";
import TodayLetters from "./first/TodayLetters";
import ActivityStats from "./third/ActivityStats";
import QuickWrite from "./four/QuickWrite";

export default function DashboardContents() {
  return (
    <>
      <div className="flex-1 h-full overflow-y-auto p-8">
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
      </div>
    </>
  );
}
