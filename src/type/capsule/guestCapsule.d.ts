/* 비밀번호 유무 */
type ReadCapsuleRequest = {
  uuid: string;
};

type ReadCapsulePasswordData = {
  capsuleId: number;
  isProtected: number;
  existedPassword: boolean;
};

type CapsuleReadRequest = {
  capsuleId: number;
  unlockAt: string; // ISO string
  locationLat?: number;
  locationLng?: number;
  password?: string | null;
};

type CapsuleReadData = {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string;
  senderNickname: string;
  title: string;
  content: string;
  createAt: string;
  viewStatus: boolean;
  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  unlockAt: string;
  unlockUntil: string;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  result: string;
};

type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

type CapsuleSaveRequest = {
  capsuleId: number;
  isSendSelf: 0 | 1;
  unlockAt: string;
};

type CapsuleSaveData = {
  message: string;
};
