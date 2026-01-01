type UnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";

interface CreatePrivateCapsuleRequest {
  memberId: number;
  nickname: string;
  receiverNickname: string;
  recipientPhone?: string | null;
  capsulePassword?: string | null;
  title: string;
  content: string;
  visibility: Visibility;
  unlockType: UnlockType;
  unlockAt?: string;
  unlockUntil?: string | null;
  locationName: string;
  address?: string;
  locationLat: number;
  locationLng: number;
  viewingRadius: number;
  packingColor: string;
  contentColor: string;
  maxViewCount: number;
  capsuleColor?: string;
  capsulePackingColor?: string;
}

interface CreateMyCapsuleRequest {
  memberId: number;
  nickname: string;
  receiverNickname: string;
  title: string;
  content: string;
  visibility: Visibility;
  unlockType: UnlockType;
  unlockAt?: string;
  unlockUntil?: string | null;
  locationName: string;
  address?: string;
  locationLat: number;
  locationLng: number;
  viewingRadius: number;
  packingColor: string;
  contentColor: string;
  maxViewCount: number;
}

interface CreatePublicCapsuleRequest {
  memberId: number;
  nickname: string;
  title: string;
  content: string;
  capPassword?: string;
  capsuleColor: string;
  capsulePackingColor: string;
  packingColor?: string;
  contentColor?: string;
  visibility: Visibility;
  unlockType: UnlockType;
  unlockAt?: string;
  unlockUntil?: string | null;
  locationName: string;
  address?: string;
  locationLat: number;
  locationLng: number;
  locationRadiusM: number;
  maxViewCount: number | null;
  attachmentIds?: number[]; // 첨부 파일 ID 목록
}

interface CapsuleCreateResponse {
  memberId: number;
  capsuleId: number;
  nickname?: string;
  receiverNickname?: string;
  title: string;
  content: string;
  visibility: string;
  unlockType: string;
  unlock: unknown;
  letter: unknown;
  maxViewCount: number;
  currentViewCount: number;
  url?: string;
  capPW?: string;
}

interface CapsuleUpdateRequest {
  title?: string;
  content?: string;
}

interface CapsuleUpdateResponse {
  message: string;
}

interface CapsuleDeleteResponse {
  capsuleId: number;
  message: string;
}

interface CapsuleLikeRequest {
  capsuleId: number;
}

interface CapsuleLikeResponse {
  capsuleLikeCount: number;
  message: string;
  isLiked?: boolean; // readLike API 응답에만 포함됨
}

interface CapsuleSendReadResponse {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string;
  senderNickname: string;
  title: string;
  content: string;
  createdAt: string;
  viewStatus: boolean;
  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  unlockAt: string;
  unlockUntil: string | null;
  locationName: string;
  locationLat: number;
  locationLng: number;
  result: string;
}

interface CapsuleBackupResponse {
  status: string;
  description: string;
  authUrl: string;
}
