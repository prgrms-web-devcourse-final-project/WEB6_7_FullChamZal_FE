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

    // 2단계: S3에 직접 업로드
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
      signal,
    });

    if (!uploadResponse.ok) {
      throw new Error("S3 업로드에 실패했습니다.");
    }

    return {
      attachmentId,
      s3Key: s3Key ?? null,
      presignedUrl: null, // 업로드 완료 후에는 null로 설정
      expireAt: response.data.expireAt,
    };
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

