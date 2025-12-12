export default function Right() {
  return (
    <>
      <section className="w-full h-full p-8">
        <div className="h-full flex flex-col justify-between gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-xl">미리보기</span>
            <div className=" w-full h-full p-8 rounded-2xl bg-[#F5F1E8] border border-outline">
              {/* 여기에 편지 미리보기 작성 */}
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
