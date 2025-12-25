import { CheckCircle } from "lucide-react";

type Props = {
  title?: string;
  order?: "ordered" | "free";
  routeCount?: number;
  imageUrl?: string;
};

export default function SuccessForm({
  title = "새 스토리트랙 제목",
  order = "ordered",
  routeCount = 0,
  imageUrl,
}: Props) {
  return (
    <div className="h-full min-h-0 flex items-center justify-center">
      <div className="w-full max-w-2xl border border-outline rounded-xl p-10 space-y-8 bg-white">
        {/* 성공 메시지 */}
        <div className="flex flex-col items-center text-center gap-3">
          <CheckCircle size={48} className="text-primary-2" />
          <h3 className="text-2xl font-medium">스토리트랙이 생성되었어요!</h3>
          <p className="text-text-2">
            이제 이 트랙을 다른 사람들과 공유할 수 있어요.
          </p>
        </div>

        {/* 트랙 요약 카드 */}
        <div className="flex gap-6 border border-outline rounded-xl p-4">
          {/* 썸네일 */}
          <div className="w-32 h-32 rounded-lg bg-button-hover flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="트랙 대표 이미지"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-text-4 text-sm">이미지 없음</span>
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 space-y-2">
            <div className="text-lg font-medium">{title}</div>

            <div className="text-sm text-text-2">
              트랙 유형:{" "}
              <span className="text-text">
                {order === "ordered" ? "순서대로" : "순서 없음"}
              </span>
            </div>

            <div className="text-sm text-text-2">
              경로 개수: <span className="text-text">{routeCount}개</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
