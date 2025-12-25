import StoryHeader from "../../common/StoryHeader";
import StoryMenuTab from "../../common/StoryMenuTab";
import MineCard from "./MineCard";

export default function MineTrackPage() {
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
          <MineCard />
        </div>
      </div>
    </>
  );
}
