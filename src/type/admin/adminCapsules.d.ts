type CapsuleUnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";

type CapsuleVisibility = "PUBLIC" | "PRIVATE";
type CapsuleUnLocked = boolean;

type CapsuleLocation = {
  locationAlias: string | null;
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
};

type AdminCapsuleBase = {
  id: number;
  uuid: string;
  title: string;
  writerNickname: string;
  visibility: CapsuleVisibility;
  unlockType: CapsuleUnlockType;

  unlockAt: string | null; // ISO string
  unlockUntil: string | null; // ISO string

  recipientName: string | null;

  currentViewCount: number;
  maxViewCount: number;

  unlocked: boolean;

  deleted: boolean;
  protectedCapsule: boolean;

  reportCount: number;
  bookmarkCount: number;

  createdAt: string;
};

// 최종 캡슐 타입 (조합)
interface AdminCapsule extends AdminCapsuleBase, CapsuleLocation {}

type AdminCapsulesResponse = {
  content: AdminCapsule[];
  totalElements: number;
};

/* ----------------------------------------------- */
type AdminCapsuleDetailBase = {
  id: number;
  uuid: string;

  title: string;
  content: string;

  writerId: number;
  writerNickname: string;

  visibility: CapsuleVisibility;
  unlockType: CapsuleUnlockType;

  unlockAt: string | null; // ISO string
  unlockUntil: string | null; // ISO string

  recipientName: string | null;

  currentViewCount: number;
  maxViewCount: number;

  deleted: boolean;
  protectedCapsule: boolean;

  reportCount: number;
  bookmarkCount: number;

  createdAt: string;
};
interface AdminCapsuleDetail extends AdminCapsuleDetailBase, CapsuleLocation {}

type AdminCapsuleDetailResponse = ApiResponse<AdminCapsuleDetail>;
