import { ApiError } from "@/lib/api/fetchClient";

/**
 * 에러 코드별 사용자 친화적 메시지 매핑
 */
export const ERROR_MESSAGES: Record<
  string,
  { title: string; description: string; showRetry?: boolean }
> = {
  FCM001: {
    title: "선착순 마감되었습니다",
    description: "이 편지는 선착순 인원이 마감되어 더 이상 열람할 수 없습니다.",
    showRetry: false,
  },
  // 아래로 다른 에러 코드 추가
};

/**
 * 에러 객체에서 에러 코드 추출
 */
export function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === "object") {
    if (error instanceof ApiError) {
      return error.code;
    }
    if ("code" in error) {
      return String(error.code);
    }
  }
  return undefined;
}

/**
 * 에러 코드에 해당하는 메시지 반환
 */
export function getErrorMessage(error: unknown): {
  title: string;
  description: string;
  showRetry?: boolean;
} | null {
  const code = getErrorCode(error);
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  return null;
}

/**
 * 에러가 특정 에러 코드인지 확인
 */
export function isErrorCode(error: unknown, code: string): boolean {
  return getErrorCode(error) === code;
}
