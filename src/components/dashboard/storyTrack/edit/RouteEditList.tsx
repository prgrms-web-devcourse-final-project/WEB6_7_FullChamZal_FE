"use client";

import { useState } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import PublicLetterPicker from "../new/secondForm/PublicLetterPicker";
import Modal from "@/components/common/Modal";
import { X } from "lucide-react";

type Props = {
  order: TrackType;
  items: Letter[];
  onReplace: (stepOrder: number, newLetter: Letter) => void;
};

export default function RouteEditList({ order, items, onReplace }: Props) {
  const [openPicker, setOpenPicker] = useState<number | null>(null); // 교체할 stepOrder

  const handleReplace = (letter: Letter) => {
    if (openPicker !== null) {
      onReplace(openPicker, letter);
      setOpenPicker(null);
    }
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
                  className="border border-outline rounded-xl p-4 bg-white hover:bg-sub-2 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
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

                    <button
                      type="button"
                      onClick={() => setOpenPicker(stepOrder)}
                      className="shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline bg-white hover:bg-button-hover text-sm text-text-3 transition-colors"
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
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-outline overflow-hidden">
          <div className="px-5 py-4 border-b border-outline bg-white">
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
            />
          </div>

          <div className="px-5 py-3 border-t border-outline text-xs text-text-4">
            현재 경로에 사용 중인 편지는{" "}
            <span className="font-medium text-text-3">추가됨</span>으로
            표시돼요.
          </div>
        </div>
      </Modal>
    </>
  );
}
