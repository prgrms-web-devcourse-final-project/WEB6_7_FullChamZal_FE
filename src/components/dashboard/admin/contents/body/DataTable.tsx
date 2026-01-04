"use client";

type Column<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  skeleton?: React.ReactNode;
  className?: string;

  // 반응형
  mobileLabel?: React.ReactNode;
  hideOnMobile?: boolean;
  hideBelow?: "sm" | "md" | "lg" | "xl";
};

function SkeletonBar({ w = "w-24" }: { w?: string }) {
  return <div className={`h-5 ${w} rounded-md bg-gray-200 animate-pulse`} />;
}

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "표시할 데이터가 없습니다.",
  isLoading = false,
  skeletonRowCount = 8,
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonRowCount?: number;
}) {
  const showEmpty = !isLoading && rows.length === 0;

  return (
    <div className="rounded-2xl border border-outline overflow-x-auto overflow-y-hidden">
      <table className="min-w-387.5">
        <thead>
          <tr className="text-sm md:text-base border-b border-outline text-left [&>th]:py-2 md:[&>th]:py-4 [&>th]:px-6">
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-text-2" aria-busy={isLoading}>
          {/* Loading Skeleton */}
          {isLoading &&
            Array.from({ length: skeletonRowCount }).map((_, rIdx) => (
              <tr
                key={`sk-${rIdx}`}
                className="text-sm border-b border-sub last:border-b-0 [&>td]:py-2 md:[&>td]:py-4 [&>td]:px-4 md:[&>td]:px-6"
              >
                {columns.map((col, cIdx) => (
                  <td key={`sk-${rIdx}-${col.key}`} className={col.className}>
                    <SkeletonBar
                      w={
                        cIdx % 4 === 0
                          ? "w-16"
                          : cIdx % 4 === 1
                          ? "w-28"
                          : cIdx % 4 === 2
                          ? "w-20"
                          : "w-32"
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}

          {/* Empty */}
          {showEmpty && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-sm text-text-4"
              >
                {isLoading ? "불러오는 중" : emptyMessage}
              </td>
            </tr>
          )}

          {!isLoading &&
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="text-sm border-b border-sub last:border-b-0 [&>td]:py-2 md:[&>td]:py-4 [&>td]:px-4 md:[&>td]:px-6"
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
