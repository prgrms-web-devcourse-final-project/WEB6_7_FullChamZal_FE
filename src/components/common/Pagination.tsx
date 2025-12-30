"use client";

type PaginationProps = {
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (nextPage: number) => void;
  className?: string;
};

export default function Pagination({
  page,
  size,
  totalElements,
  onPageChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;

  return (
    <div
      className={`flex items-center justify-center gap-2 text-sm ${className}`}
    >
      <span className="text-text-4">
        총 {totalElements}개 · {page + 1}/{totalPages}
      </span>

      <button
        type="button"
        className="px-3 py-1 rounded-lg border border-outline disabled:opacity-40"
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={isFirst}
      >
        이전
      </button>

      <button
        type="button"
        className="px-3 py-1 rounded-lg border border-outline disabled:opacity-40"
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={isLast}
      >
        다음
      </button>
    </div>
  );
}
