"use client";

import { X } from "lucide-react";

export default function ModerationDetailHeader({
  title,
  id,
  onClose,
}: {
  title: string;
  id?: number;
  onClose: () => void;
}) {
  return (
    <div className="shrink-0 flex items-center justify-between border-b px-4 md:px-5 py-3 md:py-4 bg-bg">
      <div className="min-w-0">
        <div className="text-base md:text-lg font-semibold truncate">
          {title}
        </div>
        {id ? (
          <div className="text-xs md:text-sm text-gray-500 truncate">
            Log #{id}
          </div>
        ) : null}
      </div>

      <button
        className="rounded-lg p-2 hover:bg-gray-100"
        onClick={onClose}
        aria-label="close"
      >
        <X size={18} />
      </button>
    </div>
  );
}
