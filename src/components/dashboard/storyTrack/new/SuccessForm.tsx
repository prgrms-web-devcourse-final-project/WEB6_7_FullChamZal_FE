"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  order?: TrackType;
  routeCount?: number;
  imageUrl?: string;
};

export default function SuccessForm({
  title = "새 스토리트랙 제목",
  order = "SEQUENTIAL",
  routeCount = 0,
  imageUrl,
}: Props) {
  const router = useRouter();
  return (
    // 화면이 낮을 때를 대비해서: 모바일은 위로 붙이고 스크롤 가능
    <div className="h-full min-h-0 overflow-y-auto flex items-start justify-center lg:items-center lg:p-0">
      <div className="w-full max-w-2xl max-h-[calc(100dvh-2rem)] lg:max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-xl p-6 lg:p-10 space-y-6 lg:space-y-8 bg-white">
        {/* 성공 메시지 */}
        <div className="flex flex-col items-center text-center gap-1.5 md:gap-3">
          <CheckCircle size={48} className="text-primary-2 w-10 md:w-12" />
          <h3 className="text-lg md:text-2xl font-medium">
            스토리트랙이 생성되었어요!
          </h3>
          <p className="text-sm md:text-base text-text-2">
            이제 이 트랙을 다른 사람들과 공유할 수 있어요.
          </p>
        </div>

        {/* 트랙 요약 카드 */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 border border-outline rounded-xl p-4">
          {/* 썸네일 */}
          <div className="w-full h-30 md:w-32 md:h-32 rounded-lg bg-button-hover flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="트랙 대표 이미지"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-text-4 text-sm">이미지 없음</span>
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 space-y-2 text-center md:text-start">
            <div className="text-lg font-medium">{title}</div>

            <div className="text-sm text-text-2">
              트랙 유형:{" "}
              <span className="text-text">
                {order === "SEQUENTIAL" ? "순서대로" : "순서 없음"}
              </span>
            </div>

            <div className="text-sm text-text-2">
              경로 개수: <span className="text-text">{routeCount}개</span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.push("/dashboard/storyTrack/mine")}
            className="cursor-pointer py-2 px-3 md:py-3 md:px-5 ring-2 ring-primary-2 rounded-xl hover:bg-button-hover text-sm md:text-base"
          >
            확인 하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
