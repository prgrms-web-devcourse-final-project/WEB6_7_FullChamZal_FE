import { apiFetchRaw } from "../fetchClient";

/**
 * 파일 업로드 응답 DTO
 */
export type StorytrackAttachmentUploadResponse = {
  attachmentId: number;
  s3Key: string | null;
  presignedUrl: string | null;
  expireAt: string | null; // ISO 8601 형식
};

/**
 * Presigned URL 업로드 요청 DTO
 */
export type StorytrackAttachmentUploadRequest = {
  filename: string;
  mimeType: string;
  size: number;
};

/**
 * 파일 업로드 상태 타입
 */
export type StorytrackAttachmentStatus =
  | "UPLOADING" // 업로드 중
  | "PENDING" // 이미지 필터링 중
  | "TEMP" // 임시 저장 완료 (필터링 성공)
  | "DELETED" // 삭제 또는 필터링 실패
  | "USED"; // 스토리트랙에 첨부됨

/**
 * 상태 조회 응답 DTO
 */
export type StorytrackAttachmentStatusResponse = {
  attachmentId: number;
  status: StorytrackAttachmentStatus;
};

/**
 * 스토리트랙 파일 업로드 API
 */
export const storytrackAttachmentApi = {
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
  ): Promise<StorytrackAttachmentUploadResponse> => {
    // 1단계: Presigned URL 요청
    const request: StorytrackAttachmentUploadRequest = {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    };

    const response = await apiFetchRaw<{
      code: string;
      message: string;
      data: StorytrackAttachmentUploadResponse;
    }>("/api/v1/storytrack/upload/presign", {
      method: "POST",
      json: request,
      signal,
    });

    const { attachmentId, presignedUrl, s3Key } = response.data;

    if (!presignedUrl) {
      throw new Error("Presigned URL을 받지 못했습니다.");
    }

    // 2단계: S3에 직접 업로드
    // 백엔드에서 Presigned URL 생성 시 contentType과 contentLength를 서명에 포함하지 않았으므로
    // 프론트엔드에서도 이 헤더들을 보내지 않음
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {},
      credentials: "omit", // Crucial for S3 direct upload
      signal,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => "");
      // XML 에러 응답 파싱 시도
      let errorMessage = `S3 업로드에 실패했습니다. (${uploadResponse.status}: ${uploadResponse.statusText})`;
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(errorText, "text/xml");
        const code = xmlDoc.getElementsByTagName("Code")[0]?.textContent;
        const message = xmlDoc.getElementsByTagName("Message")[0]?.textContent;
        if (code || message) {
          errorMessage = `S3 업로드 실패: ${code || ""} - ${message || ""}`;
        }
      } catch {
        // XML 파싱 실패 시 원본 에러 메시지 사용
      }

      throw new Error(errorMessage);
    }

    // 3단계: 서버에 업로드 완료 알림
    await storytrackAttachmentApi.completeUpload(attachmentId, signal);

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
    }>(`/api/v1/storytrack/upload/presign/${attachmentId}`, {
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
  ): Promise<StorytrackAttachmentStatusResponse> => {
    const response = await apiFetchRaw<{
      code: string;
      message: string;
      data: StorytrackAttachmentStatusResponse;
    }>(`/api/v1/storytrack/upload/presign/${attachmentId}`, {
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
    }>(`/api/v1/storytrack/upload/${attachmentId}`, {
      method: "DELETE",
      signal,
    });
  },
};

