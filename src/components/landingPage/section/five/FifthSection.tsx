"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const items = [
  {
    id: "love",
    img: "/img/couple.jpg",
    title: "Love & Moments",
    step: "1. 커플",
    desc: "여행 코스나 기념일에 딱 맞춰 열리는 감성 캡슐.\n같이 걸어온 길 위에 작은 서프라이즈를 남겨보세요.\n두 사람만의 순간이 하나의 이야기로 이어집니다.",
    label: "Love & Moments",
  },
  {
    id: "people",
    img: "/img/family.jpg",
    title: "People & Memories",
    step: "2. 친구·가족",
    desc: "생일 1년 전에 미리 써두는 편지.\n함께 걸었던 장소에서 열리는 메시지.\n따뜻한 마음이 시간 속에서 다시 살아납니다.",
    label: "People & Memories",
  },
  {
    id: "goals",
    img: "/img/me.jpg",
    title: "Goals & Growth",
    step: "3. 미래의 나에게",
    desc: "지금의 다짐을 미래의 나에게 보내보세요.\n3개월 뒤, 1년 뒤 도착하는 편지가 회고와 성장을 이어줍니다.",
    label: "Goals & Growth",
  },
  {
    id: "places",
    img: "/img/places.jpg",
    title: "Places & Stories",
    step: "4. 여행자·크리에이터",
    desc: "여행지, 전시, 공연 같은 장소에 이야기를 남겨보세요.\n시간이 지나 다시 찾았을 때, 그 순간의 기록이 기다리고 있습니다.",
    label: "Places & Stories",
  },
];

export default function FifthSection() {
  const [activeId, setActiveId] = useState<string>("love");

  return (
    <section id="who" className="w-full space-y-10 py-60">
      <div className="space-y-3 font-semibold">
        <h4 className="text-[#172C51] text-4xl">Dear.___</h4>
        <p className="text-primary text-3xl">Who?</p>
      </div>
      <div className="flex gap-5 h-120">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <motion.div
              key={item.id}
              layout
              onHoverStart={() => setActiveId(item.id)}
              className={`rounded-2xl h-full flex flex-col justify-end overflow-hidden transition-all bg-cover bg-center bg-no-repeat ${
                isActive ? "flex-2 shadow-xl" : "flex-1"
              }`}
              style={{ backgroundImage: `url(${item.img})` }}
            >
              {/* 카드 안쪽 레이어 컨테이너 */}
              <div className="relative w-full h-full">
                {/* 활성 내용 */}
                <motion.div
                  className="h-full flex flex-col justify-end "
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white/80 pt-8 p-10">
                    <h3 className="font-semibold text-3xl text-primary mb-2">
                      <span className="text-4xl text-[#172C51]">Dear.</span>{" "}
                      {item.title}
                    </h3>
                    <p className="font-semibold mb-3">{item.step}</p>
                    <p className="whitespace-pre-line">{item.desc}</p>
                  </div>
                </motion.div>

                {/* 비활성 상태 */}
                <motion.div
                  className="absolute inset-0 flex items-end"
                  animate={{
                    opacity: isActive ? 0 : 1,
                    y: isActive ? -10 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative w-full h-full bg-black/15 flex items-center justify-center"></div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
