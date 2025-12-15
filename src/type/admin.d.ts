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
/* Capsules */
type UnlockType = "time" | "location" | "time_location";
type CapsuleStatus = "locked" | "opened";
type CapsuleVisibility = "public" | "private";

type AdminCapsule = {
  id: number;
  title: string;
  sender: string;
  receiver: string;
  unlockType: UnlockType;
  // 해제 조건: 시간(YYYY-MM-DD HH:mm), 위치(주소/좌표), 혹은 둘 다 텍스트로
  unlockCondition: string;
  createdAt: string; // YYYY-MM-DD
  status: CapsuleStatus; // 잠김/열림
  visibility: CapsuleVisibility; // 공개/비공개 (탭용)
};

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
