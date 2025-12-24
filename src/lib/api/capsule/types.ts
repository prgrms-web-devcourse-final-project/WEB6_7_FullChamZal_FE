export type UnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";

export interface CreatePrivateCapsuleRequest {
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
  unlockUntil?: string;
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

export interface CreateMyCapsuleRequest {
  memberId: number;
  nickname: string;
  receiverNickname: string;
  title: string;
  content: string;
  visibility: Visibility;
  unlockType: UnlockType;
  unlockAt?: string;
  unlockUntil?: string;
  locationName: string;
  address?: string;
  locationLat: number;
  locationLng: number;
  viewingRadius: number;
  packingColor: string;
  contentColor: string;
  maxViewCount: number;
}

export interface CreatePublicCapsuleRequest {
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
  unlockUntil?: string;
  locationName: string;
  address?: string;
  locationLat: number;
  locationLng: number;
  maxViewCount: number;
}

export interface CapsuleCreateResponse {
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

export interface CapsuleUpdateRequest {
  title?: string;
  content?: string;
}

export interface CapsuleUpdateResponse {
  message: string;
}

export interface CapsuleDeleteResponse {
  capsuleId: number;
  message: string;
}

export interface CapsuleLikeRequest {
  capsuleId: number;
}

export interface CapsuleLikeResponse {
  likeCount: number;
  message: string;
}

export interface CapsuleSendReadResponse {
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
  unlockUntil: string | null;
  locationName: string;
  locationLat: number;
  locationLng: number;
  result: string;
}
