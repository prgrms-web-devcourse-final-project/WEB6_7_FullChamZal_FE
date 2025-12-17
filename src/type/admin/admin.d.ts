type AdminTab = "all" | "active" | "stop" | "reported";

type TabItem = { key: string; label: string };

/* 테이블 속성 타입 */
type Column<T> = {
  key: string;
  header: React.ReactNode;
  className?: string;
  // 셀 렌더러
  cell: (row: T) => React.ReactNode;
};

/* ---------------------------------------- */

/* ---------------------------------------- */
/* Phone */
type PhoneVerifyStatus =
  | "pending" // 대기중
  | "verified" // 성공
  | "failed" // 실패
  | "expired"; // 만료

type PhoneLog = {
  id: number;
  userName: string;
  phone: string;
  code: string;
  requestedAt: string; // YYYY-MM-DD HH:mm
  completedAt: string | null; // 완료 안되면 null
  ip: string;
  attempt: number;
  status: PhoneVerifyStatus;
};
