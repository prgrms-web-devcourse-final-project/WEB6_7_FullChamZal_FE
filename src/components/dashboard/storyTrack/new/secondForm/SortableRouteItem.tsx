"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableRouteItem({
  item,
  index,
  showIndex,
  onRemove,
}: {
  item: Letter;
  index: number;
  showIndex: boolean;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`border border-outline rounded-xl px-4 py-3 bg-white flex items-center gap-3
                  ${isDragging ? "opacity-80" : ""}`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="p-1 rounded-md hover:bg-button-hover text-text-4"
        aria-label="드래그해서 순서 변경"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>

      {/* Index (순서대로일 때만) */}
      {showIndex && (
        <div className="w-7 h-7 rounded-full bg-button-hover flex items-center justify-center text-xs text-text">
          {index + 1}
        </div>
      )}

      {/* 내용(캡슐 정보 보고 다시 수정 필요) */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-text truncate">{item.title}</div>
        <div className="text-xs text-text-4 truncate">
          {item.placeName ?? "위치 미지정"}
        </div>
      </div>

      {/* 삭제 */}
      <button
        type="button"
        onClick={onRemove}
        className="p-2 rounded-md hover:bg-button-hover text-text-4 hover:text-text"
        aria-label="삭제"
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
}
