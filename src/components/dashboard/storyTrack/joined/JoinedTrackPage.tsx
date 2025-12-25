import StoryHeader from "../common/StoryHeader";
import StoryMenuTab from "../common/StoryMenuTab";
import JoinedCard from "./JoinedCard";

export default function JoinedTrackPage() {
  return (
    <>
      <div className="p-8 space-y-6">
        {/* 헤더 */}
        <StoryHeader />

        {/* 메뉴 탭 */}
        <StoryMenuTab />

        {/* List */}
        <div className="grid grid-cols-3 gap-6">
          {/* Card 1 */}
          <JoinedCard />
        </div>
      </div>
    </>
  );
}
