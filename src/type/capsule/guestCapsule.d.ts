/* 비밀번호 유무 */
type ReadCapsuleRequest = {
  uuId: string;
};

type ReadCapsulePasswordData = {
  existedPassword: boolean;
};

type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

/* 조건 검증 */
type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

type CapsuleReadRequest = {
  uuId: string;
  unlockAt?: string | null; // ISO string
  locationLat?: number | null;
  locationLng?: number | null;
  password?: string | number | null;
};

type CapsuleReadData = {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string | null;
  senderNickname: string;
  title: string;
  content: string;
  createAt: string; // ISO string (응답 스펙 그대로)
  viewStatus: boolean;
  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION" | string;
  unlockAt: string | null; // ISO string
  unlockUntil: string | null; // ISO string
  locationName: string | null;
  locationLat: number | null;
  locationLng: number | null;
};
