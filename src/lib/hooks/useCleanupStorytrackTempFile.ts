/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useCallback, RefObject } from "react";

type Attachment = {
  attachmentId: number;
  fileName: string;
  previewUrl?: string;
};

/**
 * 스토리트랙 썸네일 임시 파일을 자동으로 정리하는 커스텀 훅
 *
 * - 브라우저 탭 나가기 (beforeunload)
 * - 컴포넌트 언마운트 (뒤로가기, 페이지 이동 등)
 *
 * @param uploadedAttachmentRef 업로드된 파일을 담고 있는 ref (단일 객체 또는 null)
 * @param skipCleanupRef cleanup을 스킵할지 여부를 담고 있는 ref (다음 단계 진행 중일 때 true)
 */
export function useCleanupStorytrackTempFile(
  uploadedAttachmentRef: RefObject<Attachment | null>,
  skipCleanupRef?: RefObject<boolean>
) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  /**
   * 임시 파일 삭제 함수
   * useCallback으로 메모이제이션하여 의존성 문제 해결
   */
  const cleanupFile = useCallback(
    (attachment: Attachment | null) => {
      if (!attachment) {
        return;
      }

      // 로컬 개발 환경 체크 (API_BASE_URL이 없거나 localhost일 때)
      const isLocalDev =
        !API_BASE ||
        API_BASE.includes("localhost") ||
        API_BASE.includes("127.0.0.1");

      if (isLocalDev) {
        // 미리보기 URL만 정리
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
        return;
      }

      try {
        // fetch with keepalive 옵션으로 페이지 이탈 후에도 요청이 전송되도록
        fetch(
          `${API_BASE}/api/v1/storytrack/upload/${attachment.attachmentId}`,
          {
            method: "DELETE",
            keepalive: true,
            credentials: "include", // 쿠키 기반 인증을 위해 필요
          }
        )
          .then(() => {})
          .catch(() => {
            // 실패해도 무시 (서버 스케줄러가 처리)
          });
      } catch (e) {
        // 무시
      }

      // 미리보기 URL 정리
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    },
    [API_BASE]
  );

  // 브라우저 탭 나가기 시 임시 파일 삭제 (beforeunload)
  // 참고: beforeunload에서는 비동기 작업이 완료되지 않을 수 있으므로,
  // fetch with keepalive 옵션 사용하여 페이지 이탈 후에도 요청이 전송되도록 함
  // 단, skipCleanupRef가 true인 경우 (다음 단계 진행 중)에는 cleanup을 스킵
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 다음 단계로 진행하는 경우 cleanup을 스킵
      // beforeunload 시점에 최신 ref 값을 읽어야 하므로 ref.current 직접 사용
      const shouldSkip = skipCleanupRef?.current;
      if (shouldSkip) {
        return;
      }

      // beforeunload 시점에 최신 ref 값을 읽어야 하므로 ref.current 직접 사용
      const attachment = uploadedAttachmentRef.current;
      cleanupFile(attachment);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadedAttachmentRef, skipCleanupRef, cleanupFile]);

  // 컴포넌트 언마운트 시 (뒤로가기, 페이지 이동, 취소 버튼 클릭 등) 임시 파일 삭제
  // 단, skipCleanupRef가 true인 경우 (다음 단계 진행 중)에는 cleanup을 스킵
  useEffect(() => {
    return () => {
      // cleanup 함수는 언마운트 시점에 실행되며, 이 시점의 최신 ref 값을 읽어야 함
      // cleanup 시점에 ref.current를 읽는 것은 의도적인 동작 (최신 값을 읽기 위해)
      // ref는 변경 가능한 값이므로 cleanup 시점의 최신 값을 읽는 것이 올바름
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (skipCleanupRef?.current) {
        return;
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      const attachment = uploadedAttachmentRef.current;
      cleanupFile(attachment);
    };
  }, [uploadedAttachmentRef, skipCleanupRef, cleanupFile]);
}

/**
 * 스토리트랙 썸네일 임시 파일을 수동으로 정리하는 함수
 * - 취소 버튼 클릭 시
 * - 페이지 이탈 시 (beforeunload, 언마운트)
 */
export function cleanupStorytrackTempFile(attachmentId: number) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  try {
    fetch(`${API_BASE}/api/v1/storytrack/upload/${attachmentId}`, {
      method: "DELETE",
      credentials: "include",
    }).catch(() => {
      // 실패해도 무시 (서버 스케줄러가 처리)
    });
  } catch {
    // 무시
  }
}
