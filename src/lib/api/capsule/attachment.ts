import { apiFetchRaw } from "../fetchClient";

/**
 * 파일 업로드 응답 DTO
 */
export type CapsuleAttachmentUploadResponse = {
  attachmentId: number;
  s3Key: string | null;
  presignedUrl: string | null;
  expireAt: string | null; // ISO 8601 형식
};

/**
 * Presigned URL 업로드 요청 DTO
 */
export type CapsuleAttachmentUploadRequest = {
  filename: string;
  mimeType: string;
  size: number;
};

/**
 * 파일 업로드 상태 타입
 */
export type CapsuleAttachmentStatus =
  | "UPLOADING" // 업로드 중
  | "PENDING" // 이미지 필터링 중
  | "TEMP" // 임시 저장 완료 (필터링 성공)
  | "DELETED" // 삭제 또는 필터링 실패
  | "USED"; // 캡슐에 첨부됨

/**
 * 상태 조회 응답 DTO
 */
export type CapsuleAttachmentStatusResponse = {
  attachmentId: number;
  status: CapsuleAttachmentStatus;
};

/**
 * 파일 업로드 API
 */
export const attachmentApi = {
  /**
   * 서버 업로드 방식
   * - 파일을 multipart/form-data로 서버에 전송
   * - 서버가 S3에 업로드하고 DB에 저장
   * - 응답: attachmentId만 반환 (나머지는 null)
   */
  uploadByServer: async (
    file: File,
    signal?: AbortSignal
  ): Promise<CapsuleAttachmentUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiFetchRaw<{
      code: string;
      message: string;
      data: CapsuleAttachmentUploadResponse;
    }>("/api/v1/capsule/upload", {
      method: "POST",
      body: formData,
      signal,
      // FormData를 사용할 때는 Content-Type 헤더를 설정하지 않음 (브라우저가 자동으로 boundary 설정)
      headers: {},
    });

    return response.data;
  },

  /**
   * Presigned URL 업로드 방식
   * - 1단계: 메타데이터만 서버에 전송하여 presignedUrl 받기
   * - 2단계: 받은 presignedUrl로 S3에 직접 업로드
   * - 3단계: S3 업로드 완료 후 서버에 완료 알림
   * - 응답: attachmentId + s3Key + presignedUrl + expireAt
   */
  uploadByPresignedUrl: async (
    file: File,
    signal?: AbortSignal
  ): Promise<CapsuleAttachmentUploadResponse> => {
    // 1단계: Presigned URL 요청
    const request: CapsuleAttachmentUploadRequest = {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    };

    const response = await apiFetchRaw<{
      code: string;
      message: string;
      data: CapsuleAttachmentUploadResponse;
    }>("/api/v1/capsule/upload/presign", {
      method: "POST",
      json: request,
      signal,
    });

    const { attachmentId, presignedUrl, s3Key } = response.data;

    if (!presignedUrl) {
      throw new Error("Presigned URL을 받지 못했습니다.");
    }

    // 디버깅: Presigned URL의 SignedHeaders 확인
    /* const signedHeaders = new URL(presignedUrl).searchParams.get(
      "X-Amz-SignedHeaders"
    );
    console.log("SignedHeaders=", signedHeaders);
    console.log("Presigned URL (PUT 요청 전):", presignedUrl); */

    // 2단계: S3에 직접 업로드
    // 백엔드에서 Presigned URL 생성 시 contentType과 contentLength를 서명에 포함하지 않았으므로
    // 프론트엔드에서도 이 헤더들을 보내지 않음
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        // "Content-Type": file.type,
        // "x-amz-acl": "public-read",
      },
      credentials: "omit",
      signal,
    });

    if (!uploadResponse.ok) {
      throw new Error("S3 업로드에 실패했습니다.");
    }

    // 3단계: 서버에 업로드 완료 알림
    await attachmentApi.completeUpload(attachmentId, signal);

    return {
      attachmentId,
      s3Key: s3Key ?? null,
      presignedUrl: null, // 업로드 완료 후에는 null로 설정
      expireAt: response.data.expireAt,
    };
  },

  /**
   * 업로드 완료 요청
   * - S3 업로드 완료 후 서버에 알림
   * - 서버에서 이미지 필터링 시작 (비동기)
   */
  completeUpload: async (
    attachmentId: number,
    signal?: AbortSignal
  ): Promise<void> => {
    await apiFetchRaw<{
      code: string;
      message: string;
      data: Record<string, never>;
    }>(`/api/v1/capsule/upload/presign/${attachmentId}`, {
      method: "POST",
      signal,
    });
  },

  /**
   * 업로드 상태 조회
   * - 이미지 필터링 상태 확인용
   */
  getStatus: async (
    attachmentId: number,
    signal?: AbortSignal
  ): Promise<CapsuleAttachmentStatusResponse> => {
    const response = await apiFetchRaw<{
      code: string;
      message: string;
      data: CapsuleAttachmentStatusResponse;
    }>(`/api/v1/capsule/upload/presign/${attachmentId}`, {
      method: "GET",
      signal,
    });

    return response.data;
  },

  /**
   * 임시 파일 삭제
   */
  deleteTemp: async (
    attachmentId: number,
    signal?: AbortSignal
  ): Promise<void> => {
    await apiFetchRaw<{
      code: string;
      message: string;
      data: Record<string, never>;
    }>(`/api/v1/capsule/upload/${attachmentId}`, {
      method: "DELETE",
      signal,
    });
  },
};
