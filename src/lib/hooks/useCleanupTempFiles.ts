import { useEffect, useCallback, RefObject } from "react";

type Attachment = {
  attachmentId: number;
  fileName: string;
  previewUrl?: string;
};

/**
 * 업로드된 임시 파일을 자동으로 정리하는 커스텀 훅
 *
 * - 브라우저 탭 나가기 (beforeunload)
 * - 컴포넌트 언마운트 (뒤로가기, 페이지 이동 등)
 *
 * @param uploadedAttachmentsRef 업로드된 파일 목록을 담고 있는 ref
 */
export function useCleanupTempFiles(
  uploadedAttachmentsRef: RefObject<Attachment[]>
) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  /**
   * 임시 파일 삭제 함수
   * useCallback으로 메모이제이션하여 의존성 문제 해결
   */
  const cleanupFiles = useCallback(
    (attachments: Attachment[]) => {
      if (attachments.length === 0) return;

      attachments.forEach((attachment) => {
        try {
          // fetch with keepalive 옵션으로 페이지 이탈 후에도 요청이 전송되도록
          fetch(
            `${API_BASE}/api/v1/capsule/upload/${attachment.attachmentId}`,
            {
              method: "DELETE",
              keepalive: true,
              credentials: "include", // 쿠키 기반 인증을 위해 필요
            }
          ).catch(() => {
            // 실패해도 무시 (서버 스케줄러가 처리)
          });
        } catch {
          // 무시
        }
      });

      // 미리보기 URL 정리
      attachments.forEach((attachment) => {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      });
    },
    [API_BASE]
  );

  // 브라우저 탭 나가기 시 임시 파일 삭제 (beforeunload)
  // 참고: beforeunload에서는 비동기 작업이 완료되지 않을 수 있으므로,
  // fetch with keepalive 옵션 사용하여 페이지 이탈 후에도 요청이 전송되도록 함
  useEffect(() => {
    const handleBeforeUnload = () => {
      // beforeunload 시점에 최신 ref 값을 읽어야 하므로 ref.current 직접 사용
      const attachments = uploadedAttachmentsRef.current || [];
      cleanupFiles(attachments);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadedAttachmentsRef, cleanupFiles]);

  // 컴포넌트 언마운트 시 (뒤로가기, 페이지 이동, 취소 버튼 클릭 등) 임시 파일 삭제
  useEffect(() => {
    return () => {
      // cleanup 함수는 언마운트 시점에 실행되며, 이 시점의 최신 ref 값을 읽어야 함
      // cleanup 시점에 ref.current를 읽는 것은 의도적인 동작 (최신 값을 읽기 위해)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const attachments = uploadedAttachmentsRef.current || [];
      cleanupFiles(attachments);
    };
  }, [uploadedAttachmentsRef, cleanupFiles]);
}
