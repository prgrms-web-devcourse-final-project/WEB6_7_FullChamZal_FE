"use client";

import { useState } from "react";
import Left from "./left/Left";
import Right from "./right/Right";
import WriteHeader from "./WriteHeader";
import { Eye, X } from "lucide-react";

export default function WritePage() {
  const [preview, setPreview] = useState({
    title: "",
    senderName: "",
    receiverName: "",
    content: "",
    visibility: "PRIVATE" as Visibility | "SELF",
    authMethod: "URL",
    unlockType: "TIME",
    charCount: 0,
    envelopeColorName: "",
    paperColorName: "",
    paperColorHex: "#F5F1E8",
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <WriteHeader />

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden bg-sub">
        {/* Left: 입력 폼 */}
        <div
          className={["w-full lg:w-1/2 overflow-y-auto", "pb-20 lg:pb-0"].join(
            " "
          )}
        >
          <Left preview={preview} onPreviewChange={setPreview} />
        </div>

        {/* Right: 데스크탑 고정 미리보기 */}
        <div className="w-1/2 hidden lg:flex border-l border-outline overflow-hidden min-h-0">
          <Right preview={preview} />
        </div>
      </div>

      {/* 모바일: 고정 미리보기 버튼 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-bg/80 backdrop-blur border-t border-outline">
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-primary-2 text-white py-3"
        >
          <Eye size={18} />
          미리보기
        </button>
      </div>

      {/* 모바일: 바텀시트 미리보기 */}
      {isPreviewOpen ? (
        <div
          className="lg:hidden fixed inset-0 z-9999 bg-black/40"
          onMouseDown={() => setIsPreviewOpen(false)}
        >
          <div
            className="absolute left-0 right-0 bottom-0 bg-bg rounded-t-2xl border-t border-outline
                       h-[85dvh] flex flex-col overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline">
              <div className="font-medium">미리보기</div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="cursor-pointer p-2 rounded-lg hover:bg-outline/30"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Right preview={preview} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
