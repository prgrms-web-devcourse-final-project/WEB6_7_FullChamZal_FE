"use client";

import Button from "@/components/common/Button";
import { AlertTriangle } from "lucide-react";

export default function ApiError({
  title = "데이터를 불러오지 못했어요",
  description = "일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex w-full h-full items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-md rounded-2xl border border-outline bg-white p-8 text-center shadow-sm">
        {/* 아이콘 */}
        <div className="mx-auto mb-4 inline-flex p-3 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        {/* 타이틀 */}
        <h2 className="text-lg font-semibold text-text">{title}</h2>

        {/* 설명 */}
        <p className="mt-2 whitespace-pre-line text-sm text-text-3 break-keep">
          {description}
        </p>

        {/* 액션 */}
        <div className="mt-6 flex justify-center gap-2">
          {onRetry && (
            <Button type="button" onClick={onRetry} className="px-6 py-2">
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
