import StorytrackCardSkeleton from "./StorytrackCardSkeleton";
import StorytrackHeaderSkeleton from "./StorytrackHeaderSkeleton";

export default function StorytrackPageSkeleton() {
  return (
    <>
      <div className="p-4 space-y-4 lg:p-8 lg:space-y-6">
        {/* Header */}
        <StorytrackHeaderSkeleton />

        {/* 카드 */}
        <StorytrackCardSkeleton count={4} />
      </div>
    </>
  );
}
