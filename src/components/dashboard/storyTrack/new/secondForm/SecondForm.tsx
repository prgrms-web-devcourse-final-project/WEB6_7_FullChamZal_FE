"use client";

import { useState } from "react";
import { Map, Plus, X } from "lucide-react";

import PublicLetterPicker from "./PublicLetterPicker";
import SelectedRouteList from "./SelectedRouteList";
import RouteMap from "./RouteMap";

type Props = {
  order: OrderType;
  value: { routeItems: Letter[] };
  onChange: (patch: Partial<{ routeItems: Letter[] }>) => void;
};

export default function SecondForm({ order, value, onChange }: Props) {
  const [openPicker, setOpenPicker] = useState(false);
  const [openMap, setOpenMap] = useState(false);

  const routeItems = value.routeItems;

  const addLetter = (letter: Letter) => {
    if (routeItems.some((x) => x.id === letter.id)) return;
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
        {/* Left - 경로 설정 */}
        <div className="flex-1 h-full min-h-0 border border-outline rounded-xl p-4 lg:p-8 flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-4 lg:space-y-6">
            {/* 헤더 + 지도 보기 버튼을 내부로 이동 */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="text-base lg:text-xl">경로 설정</div>
                <p className="text-xs md:text-sm text-text-2">
                  공개 편지 목록에서 클릭하여 선택하세요.
                  <br />
                  드래그하여 순서를 변경할 수 있습니다.
                </p>
              </div>

              {/* 모바일에서만 보이는 지도 버튼 (고정 버튼 제거) */}
              <button
                type="button"
                onClick={() => setOpenMap(true)}
                className="md:hidden flex-none inline-flex items-center gap-1 rounded-full border border-outline bg-white px-3 py-2 text-sm text-text-3 hover:bg-button-hover"
              >
                <Map size={16} />
                지도
              </button>
            </div>

            {/* 버튼 */}
            <button
              type="button"
              onClick={() => setOpenPicker((v) => !v)}
              className="cursor-pointer flex items-center justify-center gap-1 text-text-3 py-2 md:py-4 w-full border border-outline rounded-xl hover:bg-button-hover text-xs md:text-sm lg:text-base"
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

            <SelectedRouteList
              order={order}
              items={routeItems}
              onReorder={reorder}
              onRemove={removeLetter}
            />
          </div>
        </div>

        {/* Right - 지도 (데스크탑에서만 보여줌) */}
        <div className="hidden md:block flex-1 h-full min-h-0 border border-outline rounded-xl overflow-hidden">
          <RouteMap routeItems={routeItems} order={order} />
        </div>

        {/* 모바일: 지도 바텀시트 */}
        {openMap ? (
          <div
            className="md:hidden fixed inset-0 z-9999 bg-black/40"
            onMouseDown={() => setOpenMap(false)}
          >
            <div
              className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl border-t border-outline h-[85dvh] flex flex-col overflow-hidden"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline">
                <div className="font-medium">지도</div>
                <button
                  type="button"
                  onClick={() => setOpenMap(false)}
                  className="p-2 rounded-lg hover:bg-button-hover"
                  aria-label="닫기"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <RouteMap routeItems={routeItems} order={order} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
