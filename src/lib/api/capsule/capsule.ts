import { apiFetchRaw } from "../fetchClient";

function toIsoIfFilled(dayForm?: DayForm): string | undefined {
  if (!dayForm?.date || !dayForm?.time) return undefined;
  return new Date(`${dayForm.date}T${dayForm.time}:00`).toISOString();
}

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
  expireDayForm?: DayForm;
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
    viewingRadius:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.viewingRadius
        : 0,
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
    expireDayForm,
    locationForm,
    packingColor = "",
    contentColor = "",
  } = args;

  const unlockAt =
    effectiveUnlockType === "TIME" ||
    effectiveUnlockType === "TIME_AND_LOCATION"
      ? new Date(`${dayForm.date}T${dayForm.time}:00`).toISOString()
      : undefined;

  const expireIso = toIsoIfFilled(expireDayForm);

  const unlockUntil =
    (effectiveUnlockType === "TIME" ||
      effectiveUnlockType === "TIME_AND_LOCATION") &&
    expireIso
      ? expireIso
      : null;

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
    unlockUntil,
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
    viewingRadius:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.viewingRadius
        : 0,
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
    expireDayForm,
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

  const expireIso = toIsoIfFilled(expireDayForm);

  const unlockUntil =
    (effectiveUnlockType === "TIME" ||
      effectiveUnlockType === "TIME_AND_LOCATION") &&
    expireIso
      ? expireIso
      : null;

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
    unlockUntil,
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
    viewingRadius:
      effectiveUnlockType === "LOCATION" ||
      effectiveUnlockType === "TIME_AND_LOCATION"
        ? locationForm.viewingRadius
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

/**
 * 캡슐 수정 API 호출 (인증 필요)
 * @param capsuleId 수정할 캡슐 ID
 * @param payload 수정할 제목/내용
 */
export async function updateCapsule(
  capsuleId: number,
  payload: CapsuleUpdateRequest
): Promise<CapsuleUpdateResponse> {
  return apiFetchRaw<CapsuleUpdateResponse>(
    `/api/v1/capsule/update?capsuleId=${capsuleId}`,
    {
      method: "PUT",
      json: payload,
    }
  );
}

/**
 * 캡슐 삭제 API 호출 - 발신자 삭제 (인증 필요)
 * @param capsuleId 삭제할 캡슐 ID
 */
export async function deleteCapsuleAsSender(
  capsuleId: number
): Promise<ApiResponse<CapsuleDeleteResponse>> {
  return apiFetchRaw<ApiResponse<CapsuleDeleteResponse>>(
    `/api/v1/capsule/delete/sender?capsuleId=${capsuleId}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * 캡슐 삭제 API 호출 - 수신자 삭제 (인증 필요)
 * @param capsuleId 삭제할 캡슐 ID
 */
export async function deleteCapsuleAsReceiver(
  capsuleId: number
): Promise<ApiResponse<CapsuleDeleteResponse>> {
  return apiFetchRaw<ApiResponse<CapsuleDeleteResponse>>(
    `/api/v1/capsule/delete/reciver?capsuleId=${capsuleId}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * 캡슐 좋아요 수 읽기 API 호출
 * @param capsuleId 캡슐 ID
 */
export async function getCapsuleLikeCount(
  capsuleId: number
): Promise<ApiResponse<CapsuleLikeResponse>> {
  return apiFetchRaw<ApiResponse<CapsuleLikeResponse>>(
    `/api/v1/capsule/readLike?capsuleId=${capsuleId}`,
    {
      method: "GET",
    }
  );
}

/**
 * 캡슐 좋아요 증가 API 호출 (인증 필요)
 * @param capsuleId 캡슐 ID
 */
export async function likeCapsule(
  capsuleId: number
): Promise<ApiResponse<CapsuleLikeResponse>> {
  return apiFetchRaw<ApiResponse<CapsuleLikeResponse>>(
    "/api/v1/capsule/likeUp",
    {
      method: "POST",
      json: { capsuleId },
    }
  );
}

/**
 * 캡슐 좋아요 감소 API 호출 (인증 필요)
 * @param capsuleId 캡슐 ID
 */
export async function unlikeCapsule(
  capsuleId: number
): Promise<ApiResponse<CapsuleLikeResponse>> {
  return apiFetchRaw<ApiResponse<CapsuleLikeResponse>>(
    "/api/v1/capsule/likeDown",
    {
      method: "POST",
      json: { capsuleId },
    }
  );
}

/**
 * 수신자 캡슐 조회 API 호출 (인증 필요)
 * 사용자가 보낸 캡슐의 내용을 조건 없이 보여줍니다.
 * @param capsuleId 캡슐 ID
 */
export async function readSendCapsule(
  capsuleId: number
): Promise<ApiResponse<CapsuleSendReadResponse>> {
  return apiFetchRaw<ApiResponse<CapsuleSendReadResponse>>(
    `/api/v1/capsule/readSendCapsule?capsuleId=${capsuleId}`,
    {
      method: "GET",
    }
  );
}
