"use client";

import { ChevronFirst } from "lucide-react";
import Step from "./Step";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const STEP_LABELS = ["Write", "Set Conditions", "Send the Link", "It Opens"];

const stepsData: StepData[] = [
  {
    img: "https://cdn.pixabay.com/photo/2021/01/30/15/14/akita-5964180_640.jpg",
    icon: <ChevronFirst size={30} />,
    step: "1",
    title: "마음이 시작되는 첫 줄을 적어요",
    contents:
      "전하고 싶은 말, 사진, 그리고 그 순간의 감정까지 편지에 담아요. \n미뤄두었던 이야기도, 쉽게 말하지 못했던 마음도 괜찮아요. 이 편지는 지금의 당신을 그대로 기록해 두는 첫 걸음입니다.",
  },
  {
    img: "https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_640.jpg",
    icon: <ChevronFirst size={30} />,
    step: "2",
    title: "편지가 열릴 순간을 정해요",
    contents:
      "이 편지를 ‘언제’ 또는 ‘어디에서’ 열고 싶나요?\n기념일, 여행지, 추억의 장소처럼 특별한 조건을 설정하면 편지은 잠긴 채로, 당신이 정한 순간을 조용히 기다립니다.",
  },
  {
    img: "https://cdn.pixabay.com/photo/2016/11/29/09/58/dog-1868871_640.jpg",
    icon: <ChevronFirst size={30} />,
    step: "3",
    title: "도착하지만 아직 열리지 않는 편지예요",
    contents:
      "링크를 보내는 순간, 편지는 목적지로 향하지만 봉인은 그대로예요. \n받는 사람은 이미 알고 있으면서도, 아직은 열 수 없다는 사실에 작은 설렘과 궁금함을 함께 느끼게 됩니다.",
  },
  {
    img: "https://cdn.pixabay.com/photo/2015/03/07/03/46/white-shepherd-662744_640.jpg",
    icon: <ChevronFirst size={30} />,
    step: "4",
    title: "순간이 찾아오면 편지가 열립니다",
    contents:
      "정해둔 시간이나 장소에 도착하는 그 순간,\n편지는 딱! 하고 열리며 오래 간직했던 마음을 전합니다.\n기다림이 감동으로 바뀌는 순간, 디어가 만들어드리는 경험입니다.",
  },
];

export default function FourthSection() {
  const [activeIndex, setActiveIndex] = useState(0); // 현재 보이는 Step 인덱스
  const stepRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        id="how"
        className="relative flex flex-col md:flex-row md:gap-18 py-20 md:py-60"
      >
        {/* left */}
        <div className="hidden md:block flex-2 max-w-180 md:sticky md:top-25 lg:top-40 space-y-10 self-start">
          {/* 여기 래퍼 div 추가 */}
          <div key={activeIndex} className="space-y-10 fade-up">
            <div className="space-y-3 font-semibold">
              <h4 className="text-admin text-4xl">Dear.___</h4>
              <p className="text-primary text-3xl">
                {STEP_LABELS[activeIndex] ?? "Write"}
              </p>
            </div>
            <div className="md:w-full md:h-110 rounded-xl bg-gray-400 shadow-xl">
              <Image
                src={stepsData[activeIndex].img || ""}
                alt={stepsData[activeIndex].title}
                width={800}
                height={800}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex-1 pt-20 md:pt-60 pb-25">
          <h4 className="block mb-4 md:mb-0 md:hidden font-semibold text-admin text-3xl md:text-4xl">
            Dear.___
          </h4>
          <div className="space-y-20 md:space-y-165">
            {stepsData.map((item, index) => (
              <div
                key={item.step}
                ref={(el: HTMLDivElement) => {
                  stepRefs.current[index] = el;
                }}
                data-index={index}
                className="space-y-3 md:space-y-0"
              >
                <div className="block md:hidden">
                  <p className="font-medium md:font-semibold text-primary-3 md:text-primary text-2xl md:text-3xl">
                    {STEP_LABELS[index]}
                  </p>
                  <div className="w-full h-px bg-outline"></div>
                </div>
                <Step
                  icon={item.icon}
                  step={item.step}
                  title={item.title}
                  contents={item.contents}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
