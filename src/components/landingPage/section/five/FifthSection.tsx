"use client";

import { useState } from "react";
import Text from "./Text";

const Data: FiveDataType[] = [
  {
    title: "Love & Moments",
    step: "1. 커플",
    contents:
      "여행 코스나 기념일에 맞춰 열리는 감성 편지.\n함께 걸어온 순간 곳곳에 작은 서프라이즈를 남겨보세요.\n두 사람의 이야기가 자연스럽게 이어지는 특별한 경험이 됩니다.",
  },
  {
    title: "People & Memories",
    step: "2. 친구·가족",
    contents:
      "생일 1년 전에 미리 써두는 편지처럼 마음을 담아 기록해보세요.\n함께했던 장소에서 열리는 메시지는 추억을 한 번 더 불러옵니다.\n따뜻한 마음이 시간 속에서 다시 피어나는 순간을 만날 수 있습니다.",
  },
  {
    title: "Goals & Growth",
    step: "3. 미래의 나에게",
    contents:
      "지금의 다짐과 생각을 미래의 나에게 전해보세요.\n3개월 뒤, 1년 뒤에 도착하는 편지가 성장의 기준점이 됩니다.\n회고의 시간이 새로운 방향을 열어주는 특별한 경험이 됩니다.",
  },
  {
    title: "Places & Stories",
    step: "4. 여행자·크리에이터",
    contents:
      "“이곳을 찾은 누구에게나” 열리는 공개 편지를 남겨보세요.\n지도 위에 기록된 한 줄의 문장이 누군가의 여행을 완성합니다.\n공간 자체가 이야기를 품는 새로운 경험으로 바뀝니다.",
  },
  {
    title: "Daily & Comfort",
    step: "5. 일상의 나를 위한 편지",
    contents:
      "바쁜 하루 속에서도 작은 응원을 남겨보세요.\n지친 나에게, 혹은 누군가에게 건네는 짧은 문장이 큰 위로가 됩니다.\n필요한 순간에 도착하는 한마디가 일상을 부드럽게 감싸줍니다.",
  },
];

export default function FifthSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative flex justify-end w-full lg:h-180">
      {/* 텍스트 영역 */}
      <Text data={Data[active]} />

      {/* 배경 카드들 */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* 1번 카드 */}
        <div
          className="absolute top-0 left-0 w-[480px] h-60 rounded-2xl bg-gray-900 z-40 hover:shadow-2xl hover:z-50 hover:scale-[1.03] transition-all duration-300"
          onMouseEnter={() => setActive(0)}
        />

        {/* 2번 카드 */}
        <div
          className="absolute top-25 left-[180px] w-[480px] h-60 rounded-2xl bg-gray-700 z-30 hover:shadow-2xl hover:z-50 hover:scale-[1.03] transition-all duration-300"
          onMouseEnter={() => setActive(1)}
        />

        {/* 3번 카드 */}
        <div
          className="absolute top-50 left-[360px] w-[480px] h-60 rounded-2xl bg-gray-500 z-20 hover:shadow-2xl hover:z-50 hover:scale-[1.03] transition-all duration-300"
          onMouseEnter={() => setActive(2)}
        />

        {/* 4번 카드 */}
        <div
          className="absolute top-75 right-[180px] w-[480px] h-60 rounded-2xl bg-gray-400 z-10 hover:shadow-2xl hover:z-50 hover:scale-[1.03] transition-all duration-300"
          onMouseEnter={() => setActive(3)}
        />

        {/* 5번 카드 */}
        <div
          className="absolute top-100 right-0 w-[480px] h-60 rounded-2xl bg-gray-300 z-0 hover:shadow-2xl hover:z-50 hover:scale-[1.05] transition-all duration-300"
          onMouseEnter={() => setActive(4)}
        />
      </div>
    </section>
  );
}
