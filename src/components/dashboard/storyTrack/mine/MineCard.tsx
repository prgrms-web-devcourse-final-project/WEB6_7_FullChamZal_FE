import { ListOrdered, MapPin, Shuffle, Users } from "lucide-react";
import Image from "next/image";

export default function MineCard({ track }: { track: StoryTrackJoinedItem }) {
  return (
    <>
      <div className="border border-outline rounded-xl">
        {/* Top */}
        <Image
          src="https://cdn.pixabay.com/photo/2024/01/15/21/13/puppy-8510899_1280.jpg"
          alt={track.title}
          width={800}
          height={200}
          className="w-full h-40 object-cover rounded-t-xl"
        />

        {/* Bottom */}
        <div className="p-6 space-y-4">
          {/* 제목과 소개 */}
          <div className="space-y-1">
            <p>{track.title}</p>
            <p className="text-sm text-text-3 line-clamp-2 break-keep">
              {track.description}
            </p>
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
              {track.totalMemberCount}명
            </div>
          </div>

          {/* 생성일 */}
          <div className="text-xs text-text-3">
            생성일: {track.createdAt.slice(0, 10)}
          </div>
        </div>
      </div>
    </>
  );
}
