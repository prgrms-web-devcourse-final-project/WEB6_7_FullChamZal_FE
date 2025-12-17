type TabItem = { key: string; label: string };

/* 테이블 속성 타입 */
type Column<T> = {
  key: string;
  header: React.ReactNode;
  className?: string;
  // 셀 렌더러
  cell: (row: T) => React.ReactNode;
};
