"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import PublicLetterPicker from "./PublicLetterPicker";
import SelectedRouteList from "./SelectedRouteList";

type Props = {
  order: OrderType;
  value: { routeItems: Letter[] };
  onChange: (patch: Partial<{ routeItems: Letter[] }>) => void;
};

export default function SecondForm({ order, value, onChange }: Props) {
  /* Id를 받아야 하기 때문에 수정 필요함!! */

  const [openPicker, setOpenPicker] = useState(false);

  const routeItems = value.routeItems;

  const addLetter = (letter: Letter) => {
    if (routeItems.some((x) => x.id === letter.id)) return; // 중복 방지
    onChange({ routeItems: [...routeItems, letter] });
  };

  const removeLetter = (id: string) => {
    onChange({ routeItems: routeItems.filter((x) => x.id !== id) });
  };

  const reorder = (next: Letter[]) => {
    onChange({ routeItems: next });
  };

  return (
    <div className="h-full min-h-0">
      <div className="flex gap-8 h-full min-h-0">
        {/* Left - 지도 */}
        <div className="flex-1 h-full min-h-0 border border-outline rounded-xl p-8 flex items-center justify-center text-text-4 overflow-hidden">
          지도 영역
        </div>

        {/* Right - 경로 설정 */}
        <div className="flex-1 h-full min-h-0 border border-outline rounded-xl p-8 flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-6">
            <div className="space-y-2">
              <div className="text-xl">경로 설정</div>
              <p className="text-sm text-text-2">
                지도에서 위치를 클릭하여 경로를 추가하세요. 드래그하여 순서를
                변경할 수 있습니다.
              </p>
            </div>

            {/* 버튼 */}
            <button
              type="button"
              onClick={() => setOpenPicker((v) => !v)}
              className="cursor-pointer flex items-center justify-center gap-1 text-text-3 py-4 w-full border border-outline rounded-xl hover:bg-button-hover"
            >
              <Plus size={20} />
              내가 작성한 공개 편지 목록에서 선택
            </button>

            {/* 인라인 Picker */}
            {openPicker && (
              <div className="border border-outline rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-white">
                  <div className="text-sm text-text">공개 편지 목록</div>
                  <button
                    type="button"
                    onClick={() => setOpenPicker(false)}
                    className="p-1 rounded-md hover:bg-button-hover"
                    aria-label="닫기"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="max-h-90 overflow-y-auto">
                  <PublicLetterPicker
                    onSelect={(letter: Letter) => {
                      addLetter(letter);
                      setOpenPicker(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* ✅ 선택된 경로 리스트 (분리 컴포넌트) */}
            <SelectedRouteList
              order={order}
              items={routeItems}
              onReorder={reorder}
              onRemove={removeLetter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
