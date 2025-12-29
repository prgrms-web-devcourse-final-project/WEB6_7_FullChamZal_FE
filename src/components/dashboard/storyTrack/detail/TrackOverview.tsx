import { ListOrdered, Route, Users, X } from "lucide-react";

export default function TrackOverview() {
  return (
    <>
      <div className="p-6 flex flex-col h-full">
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            <div className="space-y-4">
              {/* 제목 */}
              <div className="text-xl">서울 한강 이야기</div>
              {/* 요약 */}
              <div className="flex gap-2">
                <div className="bg-primary-5/60 border-2 border-primary-4 rounded-full px-2 py-1 flex items-center gap-1 text-primary-2">
                  <ListOrdered size={16} />
                  <span className="text-sm">순서대로</span>
                  {/* <Shuffle size={18} />
                  <span>순서무관</span> */}
                </div>

                <div className="bg-button-hover border-2 border-outline rounded-full px-2 flex items-center gap-1 text-text-2">
                  <Route size={16} />
                  <span className="text-sm">5개 장소</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-text-3">
                <Users size={16} />
                <span className="text-sm">123명 참여 중</span>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full h-px bg-outline"></div>

            {/* 소개 */}
            <div className="space-y-4">
              {/* 소개 내용 */}
              <div className="text-sm space-y-2">
                <p>트랙 소개</p>
                <p className="text-text-3 break-keep">
                  한강을 따라 펼쳐지는 추억의 여정. 여의도부터 뚝섬까지, 각
                  장소마다 숨겨진 이야기를 발견하세요. 이 스토리트랙은 한강의
                  아름다운 풍경과 함께 서울의 현대사가 담긴 특별한 장소들을
                  탐방합니다. 각 지점마다 준비된 편지를 통해 그 장소만의
                  이야기를 만나보세요.
                </p>
              </div>

              {/* 작성자 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  홍
                </div>
                <div className="flex flex-col">
                  {/* <span className="text-sm text-text-4">만든 사람</span> */}
                  <span>홍길동</span>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full h-px bg-outline"></div>

            {/* 생성일 */}
            <span className="text-text-3">생성일: 2025.12.01</span>
          </div>

          {/* 버튼 */}
          <div className="w-full">
            {/* <button className="cursor-pointer bg-text-2 hover:bg-text-3 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Pencil />
            수정
          </button>
          <button className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Trash2 />
            삭제
          </button> */}
            <button className="w-full flex items-center justify-center gap-2 cursor-pointer bg-primary hover:bg-primary-3 text-white px-4 py-3 rounded-xl ">
              <X />
              참여 중지
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
