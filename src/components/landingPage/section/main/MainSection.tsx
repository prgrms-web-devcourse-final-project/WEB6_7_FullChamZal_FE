"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { ArrowRight } from "lucide-react";
import Background from "./Background";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";

export default function MainSection() {
  const words: string[] = ["You", "Time", "There", "Now", "___"];

  const [wordIndex, setWordIndex] = useState(0); // 몇 번째 단어인지
  const [charIndex, setCharIndex] = useState(0); // 현재 단어에서 몇 글자까지 보여줄지
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;

    const currentWord = words[wordIndex];

    const typingSpeed = 110; // 타이핑 속도
    const deletingSpeed = 70; // 지우는 속도
    const holdDelay = 900; // 유지 시간
    const betweenWordsDelay = 400; // 다음 단어 넘어가기 전 쉬는 시간

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // 타이핑 중
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      } else {
        // 단어 하나 다 쳤을 때 마지막 단어면 여기서 끝
        if (wordIndex === words.length - 1) {
          setIsFinished(true);
        } else {
          // 잠깐 유지 후 지우기 시작
          timeout = setTimeout(() => setIsDeleting(true), holdDelay);
        }
      }
    } else {
      // 지우는 중
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex((c) => c - 1), deletingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((i) => i + 1);
        }, betweenWordsDelay);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, isFinished, words]);

  const currentWord = words[wordIndex];
  const visibleText = currentWord.slice(0, charIndex);

  return (
    <>
      <section
        id="main"
        className="relative w-full min-h-screen overflow-hidden mb-60"
      >
        <Background />
        <div className="relative w-full h-screen z-10 flex items-center justify-center font-paperozi">
          <div className="max-w-430 min-h-100 flex flex-col items-center justify-center">
            <h2 className="font-extrabold text-[112px] leading-[132px] bg-[linear-gradient(91.61deg,#FF2600_37.12%,#C9290C_77.33%)] text-transparent bg-clip-text">
              Dear.&nbsp;
              <span>{visibleText}</span>
              <span className="typing-cursor font-normal">|</span>
            </h2>
            <div className="text-center space-y-4 mt-7">
              <p className="font-semibold text-2xl">
                당신이 도착했을 때 비로소 열리는 편지
              </p>
              <p>
                특정한 시간 또는 장소에 도달하면 펼쳐지는 디지털 편지. <br />
                기다림이 만든 감동을, 가장 적절한 순간에 전하세요.
              </p>
            </div>
            <div className="font-medium flex gap-4 mt-20">
              <Button className="bg-primary py-4 px-5 font-normal">
                <span>편지 쓰기</span> <ArrowRight size={20} />
              </Button>
              <Button className="border border-outline text-text px-5 bg-white hover:bg-button-hover font-normal">
                자세히 보기
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8">
          <div className="flex flex-col gap-2 w-10 items-center justify-center">
            <span>Scroll</span>
            <div className="relative w-6 h-10 rounded-full border-2 border-primary/50">
              <span className="w-1 h-1.5 absolute left-1/2 -translate-x-1/2 top-2 bg-primary rounded-full bounce-y"></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
