type AdminTab = "all" | "active" | "suspended" | "reported";

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
/* Users */
type UserStatus = "active" | "suspended";

type AdminUser = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  joinedAt: string;
  sent: number;
  received: number;
  reportCount: number;
  status: UserStatus;
};

/* ---------------------------------------- */
type UnlockType = "time" | "location" | "time_location";
type CapsuleStatus = "locked" | "opened";
type CapsuleVisibility = "public" | "private";

/* Capsules */
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
