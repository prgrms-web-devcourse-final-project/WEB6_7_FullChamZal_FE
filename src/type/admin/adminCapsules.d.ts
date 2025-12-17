type CapsuleUnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";
type CapsuleVisibility = "PUBLIC" | "PRIVATE";

type AdminCapsule = {
  id: number;
  title: string;
  writerNickname: string;
  visibility: CapsuleVisibility;
  unlockType: CapsuleUnlockType;
  unlockAt: string | null;
  createdAt: string;
  currentViewCount: number;
  maxViewCount: number;
  deleted: boolean;
  reportCount: number;
  bookmarkCount: number;
};

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
