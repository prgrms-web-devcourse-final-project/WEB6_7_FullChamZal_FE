import { apiFetchRaw } from "../fetchClient";
import {
  CapsuleCreateResponse,
  CreatePrivateCapsuleRequest,
  CreateMyCapsuleRequest,
  CreatePublicCapsuleRequest,
  UnlockType,
} from "./types";

type BuildCommonArgs = {
  memberId: number;
  senderName: string;
  receiverNickname?: string;
  recipientPhone?: string | null;
  title: string;
  content: string;
  visibility: Visibility;
  effectiveUnlockType: UnlockType;
  dayForm: DayForm;
  locationForm: LocationForm;
  capsulePassword?: string | null;
  capsuleColor?: string;
  capsulePackingColor?: string;
  packingColor?: string;
  contentColor?: string;
};

/**
 * 화면 상태(폼) -> 내게쓰기 캡슐 DTO로 변환한다.
 * - receiverNickname은 발신자 이름을 그대로 사용
 * - address/unlockUntil은 옵션으로 둔다
 */
export function buildMyPayload(args: BuildCommonArgs): CreateMyCapsuleRequest {
  const {
    memberId,
    senderName,
    title,
    content,
    visibility,
    effectiveUnlockType,
    dayForm,
    locationForm,
  } = args;

  const unlockAt =
    effectiveUnlockType === "TIME" ||
    effectiveUnlockType === "TIME_AND_LOCATION"
      ? new Date(`${dayForm.date}T${dayForm.time}:00`).toISOString()
      : undefined;

  return {
    memberId,
    nickname: senderName,
    receiverNickname: senderName,
    title,
    content,
    visibility,
    unlockType: effectiveUnlockType,
    unlockAt,
    unlockUntil: undefined,
    locationName:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.locationLabel?.trim() || locationForm.placeName
        : "",
    address:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.address
        : "",
    locationLat:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.lat ?? 0
        : 0,
    locationLng:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.lng ?? 0
        : 0,
    viewingRadius: 0,
    packingColor: args.packingColor ?? "",
    contentColor: args.contentColor ?? "",
    maxViewCount: 0,
  };
}

/**
 * 화면 상태(폼) -> 비공개 캡슐 생성 DTO로 변환한다.
 * - unlockType/날짜/위치 상태를 백엔드가 기대하는 스키마에 맞춘다.
 */
export function buildPrivatePayload(
  args: BuildCommonArgs
): CreatePrivateCapsuleRequest {
  const {
    memberId,
    senderName,
    receiverNickname = "",
    recipientPhone = null,
    capsulePassword = null,
    title,
    content,
    visibility,
    effectiveUnlockType,
    dayForm,
    locationForm,
    packingColor = "",
    contentColor = "",
  } = args;
  const unlockAt =
    effectiveUnlockType === "TIME" ||
    effectiveUnlockType === "TIME_AND_LOCATION"
      ? new Date(`${dayForm.date}T${dayForm.time}:00`).toISOString()
      : undefined;

  return {
    memberId,
    nickname: senderName,
    receiverNickname,
    recipientPhone,
    capsulePassword,
    title,
    content,
    visibility,
    unlockType: effectiveUnlockType,
    unlockAt,
    unlockUntil: undefined,
    locationName:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.locationLabel?.trim() || locationForm.placeName
        : "",
    address:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.address
        : "",
    locationLat:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.lat ?? 0
        : 0,
    locationLng:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.lng ?? 0
        : 0,
    viewingRadius: 0,
    packingColor,
    contentColor,
    maxViewCount: 0,
  };
}

/**
 * 화면 상태(폼) -> 공개 캡슐 생성 DTO로 변환한다.
 * - capPassword, 색상, 위치 반경 등 공개 스펙 필드를 포함한다.
 */
export function buildPublicPayload(
  args: BuildCommonArgs
): CreatePublicCapsuleRequest {
  const {
    memberId,
    senderName,
    capsulePassword = null,
    title,
    content,
    visibility,
    effectiveUnlockType,
    dayForm,
    locationForm,
    capsuleColor = "",
    capsulePackingColor = "",
    packingColor = "",
    contentColor = "",
  } = args;

  const unlockAt =
    effectiveUnlockType === "TIME" ||
    effectiveUnlockType === "TIME_AND_LOCATION"
      ? new Date(`${dayForm.date}T${dayForm.time}:00`).toISOString()
      : undefined;

  return {
    memberId,
    nickname: senderName,
    title,
    content,
    capPassword: capsulePassword || undefined,
    capsuleColor,
    capsulePackingColor,
    packingColor,
    contentColor,
    visibility,
    unlockType: effectiveUnlockType,
    unlockAt,
    unlockUntil: undefined,
    address:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.address
        : "",
    locationName:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.locationLabel?.trim() || locationForm.placeName
        : "",
    locationLat:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.lat ?? 0
        : 0,
    locationLng:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.lng ?? 0
        : 0,
    locationRadiusM:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? 0
        : 0,
    maxViewCount: 0,
  };
}

/**
 * 비공개 캡슐 생성 API 호출
 * @param payload 빌드된 비공개 DTO
 */
export async function createPrivateCapsule(
  payload: CreatePrivateCapsuleRequest
): Promise<CapsuleCreateResponse> {
  return apiFetchRaw<CapsuleCreateResponse>("/api/v1/capsule/create/private", {
    method: "POST",
    json: payload,
  });
}

/**
 * 공개 캡슐 생성 API 호출
 * @param payload 빌드된 공개 DTO
 */
export async function createPublicCapsule(
  payload: CreatePublicCapsuleRequest
): Promise<CapsuleCreateResponse> {
  return apiFetchRaw<CapsuleCreateResponse>("/api/v1/capsule/create/public", {
    method: "POST",
    json: payload,
  });
}

/**
 * 내게쓰기 캡슐 생성 API 호출
 * @param payload 빌드된 내게쓰기 DTO
 */
export async function createMyCapsule(
  payload: CreateMyCapsuleRequest
): Promise<CapsuleCreateResponse> {
  return apiFetchRaw<CapsuleCreateResponse>("/api/v1/capsule/create/me", {
    method: "POST",
    json: payload,
  });
}
