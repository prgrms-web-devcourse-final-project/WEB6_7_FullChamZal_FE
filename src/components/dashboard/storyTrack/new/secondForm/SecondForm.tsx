"use client";

import { useMemo, useState } from "react";
import { Map, Plus, X } from "lucide-react";

import PublicLetterPicker from "../../common/PublicLetterPicker";
import SelectedRouteList from "./SelectedRouteList";
import RouteMap from "./RouteMap";
import Modal from "@/components/common/Modal";

type Props = {
  order: TrackType;
  value: { routeItems: Letter[] };
  onChange: (patch: Partial<{ routeItems: Letter[] }>) => void;
};

export default function SecondForm({ order, value, onChange }: Props) {
  const [openPicker, setOpenPicker] = useState(false);
  const [openMap, setOpenMap] = useState(false);

  const routeItems = value.routeItems;

  // ✅ Set은 props로 넘기지 말고 list로 넘겨서 안전하게 처리
  const selectedIdList = useMemo(
    () => routeItems.map((x) => x.id),
    [routeItems]
  );
  const selectedSet = useMemo(() => new Set(selectedIdList), [selectedIdList]);

  const addLetter = (letter: Letter) => {
    if (selectedSet.has(letter.id)) return;
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
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="text-base lg:text-xl font-semibold text-text">
                  경로 설정
                </div>
                <p className="text-xs md:text-sm text-text-2">
                  공개 편지 목록에서 클릭하여 선택하세요.
                  <br />
                  드래그하여 순서를 변경할 수 있습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenMap(true)}
                className="cursor-pointer md:hidden flex-none inline-flex items-center gap-1 rounded-full border border-outline bg-bg px-3 py-2 text-sm text-text-3 hover:bg-button-hover"
              >
                <Map size={16} />
                지도
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpenPicker(true)}
              className="cursor-pointer w-full rounded-xl border border-outline bg-bg hover:bg-button-hover
                         py-3 md:py-4 text-xs md:text-sm lg:text-base flex items-center justify-center gap-2
                         shadow-sm active:scale-[0.99] transition"
            >
              <Plus size={20} />
              공개 편지에서 선택하기
            </button>

            <SelectedRouteList
              order={order}
              items={routeItems}
              onReorder={reorder}
              onRemove={removeLetter}
            />
          </div>
        </div>

        {/* Right - 지도 (데스크탑) */}
        <div className="hidden md:block flex-1 h-full min-h-0 border border-outline rounded-xl overflow-hidden">
          <RouteMap routeItems={routeItems} order={order} />
        </div>

        {/* 공개 편지 선택 모달 */}
        <Modal open={openPicker} onClose={() => setOpenPicker(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-bg shadow-xl border border-outline overflow-hidden">
            <div className="px-5 py-4 border-b border-outline bg-bg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-text">
                    공개 편지 목록
                  </div>
                  <p className="mt-1 text-xs text-text-3">
                    선택하면 경로에 바로 추가돼요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenPicker(false)}
                  className="cursor-pointer p-2 rounded-full hover:bg-button-hover"
                  aria-label="닫기"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[70dvh] overflow-y-auto">
              <PublicLetterPicker
                selectedIds={selectedIdList} // ✅ list로 전달
                onSelect={(letter: Letter) => {
                  addLetter(letter);
                  setOpenPicker(false);
                }}
              />
            </div>

            <div className="px-5 py-3 border-t border-outline text-xs text-text-4">
              이미 추가된 편지는{" "}
              <span className="font-medium text-text-3">추가됨</span>으로
              표시돼요.
            </div>
          </div>
        </Modal>

        {/* 모바일: 지도 바텀시트 */}
        {openMap ? (
          <div
            className="md:hidden fixed inset-0 z-9999 bg-black/40"
            onClick={() => setOpenMap(false)}
          >
            <div
              className="absolute left-0 right-0 bottom-0 bg-bg rounded-t-2xl border-t border-outline h-[85dvh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline">
                <div className="font-medium">지도</div>
                <button
                  type="button"
                  onClick={() => setOpenMap(false)}
                  className="cursor-pointer p-2 rounded-lg hover:bg-button-hover"
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
