"use client";

import { ListOrdered, MapPin, Shuffle, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const DEFAULT_THUMBNAIL =
  "https://cdn.pixabay.com/photo/2024/01/15/21/13/puppy-8510899_1280.jpg";

export default function JoinedCard({ track }: { track: StoryTrackJoinedItem }) {
  // 진행률 계산
  const total = track.totalSteps ?? 0;
  const done = track.completedSteps ?? 0;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const thumbnailUrl = track.imageUrl || DEFAULT_THUMBNAIL;

  return (
    <Link
      href={`/dashboard/storyTrack/${track.storytrackId}`}
      className="block border border-outline rounded-xl hover:shadow-md transition"
    >
      <div className="relative">
        {/* Top */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={track.title}
          className="w-full h-40 object-cover rounded-t-xl"
        />

        {/* 달성도 배지 */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-2 rounded-lg text-white bg-primary-3 text-sm">
          <TrendingUp size={18} />
          <span>{percent}% 완료</span>
        </div>

        {/* Bottom */}
        <div className="p-6 space-y-4">
          {/* 제목과 소개 */}
          <div className="space-y-1">
            <p className="font-medium">{track.title}</p>
            <p className="text-sm text-text-3 line-clamp-2 break-keep">
              {track.description}
            </p>
          </div>

          {/* 작성자 프로필 */}
          <div className="flex items-center gap-1.5">
            <div className="flex-none w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">
              {track.creatorNickname?.[0] ?? "?"}
            </div>
            <p className="text-xs text-text-2">{track.creatorNickname}</p>
          </div>

          {/* 진행 상황 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-text-3">
              <span>진행 상황</span>
              <span>
                {done} / {total} 완료
              </span>
            </div>
            <div className="relative w-full h-2 bg-button-hover rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary-2 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
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
              {total}개 장소
            </div>
            <div className="flex gap-1 items-center">
              <Users size={16} />
              {track.totalMemberCount ?? 0}명
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
