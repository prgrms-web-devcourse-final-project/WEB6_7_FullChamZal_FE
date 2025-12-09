"use client";

import { ChevronFirst } from "lucide-react";
import Step from "./Step";
import { useEffect, useRef, useState } from "react";

const STEP_LABELS = ["Write", "Set Conditions", "Send the Link", "It Opens"];

const stepsData: StepData[] = [
  {
    icon: <ChevronFirst size={30} />,
    step: "1",
    title: "마음이 시작되는 첫 줄을 적어요",
    contents:
      "전하고 싶은 말, 사진, 그리고 그 순간의 감정까지 편지에 담아요. \n미뤄두었던 이야기도, 쉽게 말하지 못했던 마음도 괜찮아요. 이 편지는 지금의 당신을 그대로 기록해 두는 첫 걸음입니다.",
  },
  {
    icon: <ChevronFirst size={30} />,
    step: "2",
    title: "편지가 열릴 순간을 정해요",
    contents:
      "이 편지를 ‘언제’ 또는 ‘어디에서’ 열고 싶나요?\n기념일, 여행지, 추억의 장소처럼 특별한 조건을 설정하면 캡슐은 잠긴 채로, 당신이 정한 순간을 조용히 기다립니다.",
  },
  {
    icon: <ChevronFirst size={30} />,
    step: "3",
    title: "도착하지만 아직 열리지 않는 편지예요",
    contents:
      "링크를 보내는 순간, 편지는 목적지로 향하지만 봉인은 그대로예요. \n받는 사람은 이미 알고 있으면서도, 아직은 열 수 없다는 사실에 작은 설렘과 궁금함을 함께 느끼게 됩니다.",
  },
  {
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
        threshold: 0.5, // 요소가 50% 정도 보일 때 active로 판단
      }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="relative flex flex-row gap-18">
        {/* left */}
        <div className="flex-2 max-w-180 sticky top-40 font-semibold space-y-10 self-start">
          <div className="space-y-3">
            <h4 className="text-[#172C51] text-4xl">Dear.___</h4>
            <p className="text-[#FF2600] text-3xl">
              {STEP_LABELS[activeIndex] ?? "Write"}
            </p>
          </div>
          <div className="w-full h-110 rounded-xl bg-gray-400 shadow-xl">
            {/* 이미지 영역 */}
          </div>
        </div>

        {/* right */}
        <div className="flex-1 pt-60 pb-25">
          <div className="space-y-[660px]">
            {stepsData.map((item, index) => (
              <div
                key={item.step}
                ref={(el: HTMLDivElement) => {
                  stepRefs.current[index] = el;
                }}
                data-index={index}
              >
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
