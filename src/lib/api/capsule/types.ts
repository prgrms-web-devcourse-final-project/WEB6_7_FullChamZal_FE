export type UnlockType = "TIME" | "LOCATION" | "TIME_AND_LOCATION";

export interface CreatePrivateCapsuleRequest {
  memberId: number;
  nickname: string;
  receiverNickname: string;
  title: string;
  content: string;
  visibility: Visibility;
  unlockType: UnlockType;
  unlockAt?: string;
  locationName: string;
  locationLat: number;
  locationLng: number;
  viewingRadius: number;
  packingColor: string;
  contentColor: string;
  maxViewCount: number;
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
  visibility: Visibility;
  unlockType: UnlockType;
  unlockAt?: string;
  locationName: string;
  locationLat: number;
  locationLng: number;
  locationRadiusM: number;
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
