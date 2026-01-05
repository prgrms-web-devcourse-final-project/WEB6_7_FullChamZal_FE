"use client";

import { useState } from "react";
import { MapPin, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import PublicLetterPicker from "../common/PublicLetterPicker";
import Modal from "@/components/common/Modal";
import { X } from "lucide-react";

type Props = {
  order: TrackType;
  items: Letter[];
  onReplace: (stepOrder: number, newLetter: Letter) => void;
  onReorder: (next: Letter[]) => void;
};

export default function RouteEditList({
  order,
  items,
  onReplace,
  onReorder,
}: Props) {
  const [openPicker, setOpenPicker] = useState<number | null>(null); // 교체할 stepOrder

  const handleReplace = (letter: Letter) => {
    if (openPicker !== null) {
      onReplace(openPicker, letter);
      setOpenPicker(null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return; // 첫 번째 항목은 위로 이동 불가
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    onReorder(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return; // 마지막 항목은 아래로 이동 불가
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    onReorder(newItems);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="text-sm text-text">경로 목록</div>

        {items.length === 0 ? (
          <div className="text-sm text-text-4 border border-outline rounded-xl p-4">
            경로가 없습니다.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => {
              const stepOrder = index + 1;
              return (
                <li
                  key={`${item.id}-${stepOrder}`}
                  className="border border-outline rounded-xl p-4 bg-bg hover:bg-sub-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* 위/아래 이동 버튼 */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="cursor-pointer inline-flex items-center justify-center w-7 h-7 rounded-lg border border-outline bg-bg hover:bg-button-hover text-text-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="위로 이동"
                      >
                        <ChevronUp size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === items.length - 1}
                        className="cursor-pointer inline-flex items-center justify-center w-7 h-7 rounded-lg border border-outline bg-bg hover:bg-button-hover text-text-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="아래로 이동"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {order === "SEQUENTIAL" && (
                          <span className="shrink-0 w-6 h-6 rounded-full bg-primary-2 text-white text-xs font-medium flex items-center justify-center">
                            {stepOrder}
                          </span>
                        )}
                        <h4 className="text-sm font-medium text-text truncate">
                          {item.title || "제목 없음"}
                        </h4>
                      </div>
                      {item.placeName && (
                        <div className="flex items-center gap-1 text-xs text-text-3">
                          <MapPin size={14} />
                          <span className="truncate">{item.placeName}</span>
                        </div>
                      )}
                    </div>

                    {/* 교체 버튼 */}
                    <button
                      type="button"
                      onClick={() => setOpenPicker(stepOrder)}
                      className="shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline bg-bg hover:bg-button-hover text-sm text-text-3 transition-colors"
                    >
                      <RefreshCw size={14} />
                      교체
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 공개 편지 선택 모달 (교체용) */}
      <Modal open={openPicker !== null} onClose={() => setOpenPicker(null)}>
        <div className="w-full max-w-lg rounded-2xl bg-bg shadow-xl border border-outline overflow-hidden">
          <div className="px-5 py-4 border-b border-outline bg-bg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-text">
                  경로 {openPicker}번 교체
                </div>
                <p className="mt-1 text-xs text-text-3">
                  교체할 공개 편지를 선택하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenPicker(null)}
                className="cursor-pointer p-2 rounded-full hover:bg-button-hover"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="max-h-[70dvh] overflow-y-auto">
            <PublicLetterPicker
              selectedIds={items.map((x) => x.id)}
              onSelect={handleReplace}
              selectedLabel="선택됨"
            />
          </div>

          <div className="px-5 py-3 border-t border-outline text-xs text-text-4">
            현재 경로에 사용 중인 편지는{" "}
            <span className="font-medium text-text-3">선택됨</span>으로
            표시돼요.
          </div>
        </div>
      </Modal>
    </>
  );
}
