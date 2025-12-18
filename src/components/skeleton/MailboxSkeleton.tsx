import DivBox from "../dashboard/DivBox";

export default function MailboxSkeleton() {
  return (
    <section className="flex-1 w-full">
      <div className="p-8">
        <DivBox className="cursor-auto hover:bg-white space-y-12">
          {/* 상단 헤더 영역 */}
          <div className="flex items-center gap-4 animate-pulse">
            {/* 아이콘 자리 */}
            <div className="w-10 h-10 rounded-full bg-gray-200" />

            {/* 텍스트 자리 */}
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>

          {/* 카드 / 미리보기 영역 */}
          <div className="flex flex-wrap justify-between animate-pulse">
            <div className="w-[280px] h-[180px] rounded-lg bg-gray-200" />
            <div className="w-[280px] h-[180px] rounded-lg bg-gray-200" />
            <div className="w-[280px] h-[180px] rounded-lg bg-gray-200" />
            <div className="w-[280px] h-[180px] rounded-lg bg-gray-200" />
          </div>
        </DivBox>
      </div>
    </section>
  );
}
