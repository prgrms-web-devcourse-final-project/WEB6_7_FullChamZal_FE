import { formatDate } from "@/lib/hooks/formatDate";

type PreviewState = {
  title: string;
  senderName: string;
  receiverName: string;
  content: string;
  visibility: Visibility | "SELF";
  authMethod: string;
  unlockType: string;
  charCount: number;
};

export default function Right({ preview }: { preview: PreviewState }) {
  const { title, senderName, receiverName, content } = preview;
  const todayLabel = formatDate(new Date().toISOString());

  const visibilityLabel =
    preview.visibility === "PUBLIC"
      ? "공개"
      : preview.visibility === "SELF"
      ? "내게 쓰기"
      : "비공개";
  const authLabel =
    preview.authMethod === "NONE"
      ? "인증 없음"
      : preview.authMethod === "PHONE"
      ? "전화번호"
      : "비밀번호";
  const unlockLabel =
    preview.unlockType === "LOCATION"
      ? "장소"
      : preview.unlockType === "TIME_AND_LOCATION"
      ? "시간 + 장소"
      : "시간";
  const charCountLabel = `${preview.charCount}자`;

  return (
    <section className="w-full h-full p-8 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* 위 영역 */}
        <div className="flex-1 min-h-0 flex flex-col gap-4">
          <span className="text-xl">미리보기</span>

          <div className="flex-1 min-h-0 p-8 rounded-2xl bg-[#F5F1E8] border border-outline overflow-hidden">
            <div className="h-full min-h-0 flex flex-col justify-between gap-6">
              {/* 제목 + Dear (수신자) */}
              <div className="text-2xl space-x-1">
                <p className="font-semibold">{title || "제목을 입력하세요"}</p>
                <span className="text-primary font-bold">Dear.</span>
                <span className="text-text-3">
                  {receiverName || "수신자 이름"}
                </span>
              </div>

              {/* 편지 내용 */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <pre className="whitespace-pre-wrap wrap-break-word text-lg leading-7">
                  {content || "편지 내용을 입력하세요"}
                </pre>
              </div>

              {/* From (발신자) */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className="text-text-3">{todayLabel}</span>
                <p className="text-right text-2xl space-x-1">
                  <span className="text-primary font-bold">From.</span>
                  <span className="text-text-3">
                    {senderName || "작성자 이름"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 아래 */}
        <div className="shrink-0 w-full text-xs text-text-4 p-4 border border-outline rounded-xl bg-white/60">
          <p>편지 정보</p>
          <ul className="space-y-1">
            <li>• 테마: (편지봉투 명) & (편지지 명)</li>
            <li>• 공개 범위: {visibilityLabel}</li>
            <li>• 인증 방법: {authLabel}</li>
            <li>• 해제 조건: {unlockLabel}</li>
            <li>• 글자 수: {charCountLabel}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
