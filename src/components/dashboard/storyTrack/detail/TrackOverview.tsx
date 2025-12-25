import { X } from "lucide-react";

export default function TrackOverview() {
  return (
    <>
      <div className="p-8 flex flex-col h-full">
        <div className="flex-1 min-h-0">
          {/* 소개 내용 */}
          <div className="space-y-4">
            <p className="text-xl">트랙 소개</p>
            <p className="text-text-2">
              한강을 따라 펼쳐지는 추억의 여정. 여의도부터 뚝섬까지, 각 장소마다
              숨겨진 이야기를 발견하세요. 이 스토리트랙은 한강의 아름다운 풍경과
              함께 서울의 현대사가 담긴 특별한 장소들을 탐방합니다. 각 지점마다
              준비된 편지를 통해 그 장소만의 이야기를 만나보세요.
            </p>
          </div>

          {/* 작성자 */}
          <div></div>
        </div>

        {/* 버튼 */}
        <div className="flex-none flex justify-end">
          <button className="cursor-pointer bg-primary hover:bg-primary-3 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <X />
            참여 중지
          </button>
        </div>
      </div>
    </>
  );
}
