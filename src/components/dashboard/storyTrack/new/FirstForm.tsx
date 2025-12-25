/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  value: FirstFormValue;
  onChange: (patch: Partial<FirstFormValue>) => void;
};

export default function FirstForm({ value, onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 파일 프리뷰 URL 생성/해제
  useEffect(() => {
    if (!value.imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value.imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value.imageFile]);

  return (
    <div className="h-full min-h-0">
      <div className="flex gap-8 h-full min-h-0">
        {/* Left - 이미지 미리보기 */}
        <div className="flex-1 h-full min-h-0 border border-outline rounded-xl p-8 flex items-center justify-center text-text-4 overflow-hidden">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="대표 이미지 미리보기"
              width={800}
              height={800}
              className="max-w-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center space-y-2">
              <div className="text-base text-text-3">이미지 미리보기</div>
              <div className="text-sm text-text-4">
                대표 이미지를 선택하면 여기에 표시됩니다
              </div>
            </div>
          )}
        </div>

        {/* Right - 입력 폼 */}
        <div className="flex-1 h-full min-h-0 border border-outline rounded-xl p-8 flex flex-col">
          {/* 스크롤 영역 */}
          <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-6">
            {/* 제목 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm">
                트랙 제목
              </label>
              <input
                id="title"
                type="text"
                value={value.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="예: 서울 한강 야경 투어"
                className="border border-outline rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-2 outline-none"
              />
            </div>

            {/* 설명 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm">
                트랙 설명
              </label>
              <textarea
                id="description"
                rows={3}
                value={value.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="이 스토리트랙에 대해 설명해주세요..."
                className="resize-none border border-outline rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-2 outline-none"
              />
            </div>

            {/* 트랙 유형 */}
            <div className="flex flex-col gap-2">
              <span className="text-sm">트랙 유형</span>

              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="order"
                    value="ordered"
                    checked={value.order === "ordered"}
                    onChange={() => onChange({ order: "ordered" })}
                    className="hidden peer"
                  />
                  <div
                    className="flex items-center justify-center py-2.5 border-2 border-outline text-text-3 rounded-lg
                               peer-checked:border-primary-2 peer-checked:bg-button-hover peer-checked:text-primary-2"
                  >
                    순서대로
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="order"
                    value="free"
                    checked={value.order === "free"}
                    onChange={() => onChange({ order: "free" })}
                    className="hidden peer"
                  />
                  <div
                    className="flex items-center justify-center py-2.5 border-2 border-outline text-text-3 rounded-lg
                               peer-checked:border-primary-2 peer-checked:bg-button-hover peer-checked:text-primary-2"
                  >
                    순서 없음
                  </div>
                </label>
              </div>
            </div>

            {/* 대표 이미지 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="img" className="text-sm">
                대표 이미지
              </label>

              <input
                id="img"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  onChange({ imageFile: file });
                }}
                className="cursor-pointer border border-outline rounded-lg py-2 px-4 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-button-hover file:px-3 file:py-1.5 file:text-sm file:text-text hover:file:bg-outline/40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
