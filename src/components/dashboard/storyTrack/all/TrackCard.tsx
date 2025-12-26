import Button from "@/components/common/Button";
import { ListOrdered, MapPin, Shuffle, Users } from "lucide-react";

export default function TrackCard({ track }: { track: StoryTrackItem }) {
  return (
    <>
      <div className="border border-outline rounded-xl">
        {/* Top */}
        <div className="relative">
          {/* 이미지로 변경 */}
          <div className="w-full h-40 bg-amber-300 rounded-t-xl"></div>
        </div>
        {/* Bottom */}
        <div className="p-6 space-y-4">
          {/* 제목과 소개 */}
          <div className="space-y-1">
            <p>{track.title}</p>
            <p className="text-sm text-text-3 line-clamp-2 break-keep">
              {track.desctiption}
            </p>
          </div>

          {/* 작성자 프로필 */}
          <div className="flex items-center gap-1.5">
            <div className="flex-none w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">
              {/* 그 사람의 프로필 */}
              {track.createrName[0]}
            </div>
            <p className="text-xs text-text-2">{track.createrName}</p>
          </div>

          {/* 아이콘 요약 */}
          <div className="text-text-3 text-xs flex items-center gap-3">
            <div className="flex gap-1 items-center">
              {track.trackType === "FREE" ? (
                <>
                  <Shuffle size={18} />
                  순서 무관
                </>
              ) : (
                <>
                  <ListOrdered size={16} />
                  순서대로
                </>
              )}
            </div>
            <div className="flex gap-1 items-center">
              <MapPin size={16} />
              {track.totalSteps}개 장소
            </div>
            <div className="flex gap-1 items-center">
              <Users size={16} />
              {/* 나중에 참여자 수 추가하면 */}
              {track.totalParticipant ?? 0}명
            </div>
          </div>

          {/* 버튼 */}
          <Button className="md:font-normal gap-1 w-full py-3">
            <Users size={20} />
            참여하기
            {/* 참여 중인 리스트는 참여 중이라고 나오고 버튼 클릭 못하도록! */}
          </Button>
        </div>
      </div>
    </>
  );
}
