import { apiFetchRaw } from "../fetchClient";
import {
  CapsuleCreateResponse,
  CreatePrivateCapsuleRequest,
  CreatePublicCapsuleRequest,
  UnlockType,
} from "./types";

type BuildCommonArgs = {
  memberId: number;
  senderName: string;
  title: string;
  content: string;
  visibility: Visibility;
  effectiveUnlockType: UnlockType;
  dayForm: DayForm;
  locationForm: LocationForm;
  capsulePassword?: string;
  capsuleColor?: string;
  capsulePackingColor?: string;
};

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
    title,
    content,
    visibility,
    unlockType: effectiveUnlockType,
    unlockAt,
    locationName:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.placeName
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
    packingColor: "",
    contentColor: "",
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
    title,
    content,
    visibility,
    effectiveUnlockType,
    dayForm,
    locationForm,
    capsulePassword,
    capsuleColor = "",
    capsulePackingColor = "",
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
    visibility,
    unlockType: effectiveUnlockType,
    unlockAt,
    locationName:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.placeName
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
 * @param query   전화번호/비밀번호 전송 방식에 따른 쿼리 파라미터
 */
export async function createPrivateCapsule(
  payload: CreatePrivateCapsuleRequest,
  query?: { phoneNum?: string; capsulePassword?: string }
): Promise<CapsuleCreateResponse> {
  const searchParams = new URLSearchParams();
  if (query?.phoneNum) searchParams.set("phoneNum", query.phoneNum);
  if (query?.capsulePassword)
    searchParams.set("capsulePassword", query.capsulePassword);

  const queryString = searchParams.toString();
  const path = `/api/v1/capsule/create/private${
    queryString ? `?${queryString}` : ""
  }`;

  return apiFetchRaw<CapsuleCreateResponse>(path, {
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
