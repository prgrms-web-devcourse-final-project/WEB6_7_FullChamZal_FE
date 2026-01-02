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

type UnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";

type CapsuleAttachmentViewResponse = {
  presignedUrl: string;
  attachmentId: number;
};

type CapsuleReadData = {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string;
  senderNickname: string;
  title: string;
  content: string;
  createdAt: string;
  viewStatus: boolean;
  unlockType: UnlockType;
  unlockAt: string;
  unlockUntil: string;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  isBookmarked: boolean;
  result: string;
  attachments?: CapsuleAttachmentViewResponse[];
};

type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

type CapsuleSaveRequest = {
  capsuleId: number;
};

type CapsuleSaveData = {
  message: string;
};
