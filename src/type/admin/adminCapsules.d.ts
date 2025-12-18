type CapsuleUnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";
type CapsuleVisibility = "PUBLIC" | "PRIVATE";
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

type AdminCapsuleDetail = {
  id: number;
  title: string;
  content: string;

  writerNickname: string;

  capsuleColor: "RED" | "BLUE" | "GREEN" | "YELLOW" | "PURPLE";
  capsulePackingColor: "RED" | "BLUE" | "GREEN" | "YELLOW" | "PURPLE";

  visibility: "PUBLIC" | "PRIVATE";

  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  unlockAt: string | null;

  // LOCATION 관련
  locationName: string | null;
  locationLat: number | null;
  locationLng: number | null;
  locationRadiusM: number | null;

  currentViewCount: number;
  maxViewCount: number;

  deleted: boolean;
  protectedCapsule: boolean;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  reportCount: number;
  bookmarkCount: number;
};

type AdminCapsuleDetailResponse = ApiResponse<AdminCapsuleDetail>;
