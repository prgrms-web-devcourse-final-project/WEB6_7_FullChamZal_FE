import { formatDate } from "@/lib/formatDate";
type PreviewState = {
  title: string;
  senderName: string;
  receiverName: string;
  content: string;
};

export default function Right({ preview }: { preview: PreviewState }) {
  const { title, senderName, receiverName, content } = preview;
  const todayLabel = formatDate(new Date().toISOString());

  return (
    <>
      <section className="w-full h-full p-8">
        <div className="h-full flex flex-col justify-between gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-xl">미리보기</span>
            <div className=" w-full h-full p-8 rounded-2xl bg-[#F5F1E8] border border-outline space-y-6">
              <p className="font-semibold">{title || "제목을 입력하세요"}</p>
              <div className="text-2xl space-x-1">
                <span className="text-primary font-bold">Dear.</span>
                <span className="text-text-3">
                  {senderName || "작성자 이름"}
                </span>
              </div>
              <div className="flex-1 mx-1 overflow-x-hidden overflow-y-auto">
                <pre className="whitespace-pre-wrap wrap-break-word text-lg leading-7">
                  {content || "편지 내용을 입력하세요"}
                </pre>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className="text-text-3">{todayLabel}</span>
                <p className="text-right text-2xl space-x-1">
                  <span className="text-primary font-bold">From.</span>
                  <span className="text-text-3">
                    {receiverName || "수신자 이름"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full text-xs text-text-4 p-4 border border-outline rounded-xl bg-white/60">
            <p>편지 정보</p>
            <ul className="space-y-1">
              <li>• 테마: (편지봉투 명) & (편지지 명)</li>
              <li>• 공개 범위: 비공개</li>
              <li>• 인증 방법: 비밀번호</li>
              <li>• 해제 조건: 시간</li>
              <li>• 글자 수: 0자</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
