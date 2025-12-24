type ReportTargetType = "CAPSULE" | "LETTER" | "COMMENT";

type ReportReasonType = "SPAM" | "ABUSE" | "HATE" | "SEXUAL" | "ETC";

type ReportStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";

type AdminReport = {
  id: number;
  targetType: ReportTargetType; // 무엇을 신고했는지
  targetId: number; // 신고 대상의 ID

  reporterId: number | null; // 신고한 사람 ID
  reporterNickname: string | null; // 신고자 이름

  reasonType: ReportReasonType; // 신고 사유
  status: ReportStatus; // 관리자 처리 상태

  createdAt: string; // 신고 접수 시각
};

type AdminReportResponse = {
  content: AdminReport[];
  totalElements: number;
};

/* 신고 세부 내용 */
type AdminReportDetail = {
  id: number;
  targetType: ReportTargetType;
  targetId: number;
  targetTitle: string;
  targetWriterNickname: string;
  status: ReportStatus; // PENDING | REVIEWING | ACCEPTED | REJECTED
  reasonType: ReportReasonType; // SPAM, ABUSE 등
  reasonDetail: string;
  reporterId: number;
  reporterNickname: string;
  reporterPhone: string | null;
  processedBy: number | null;
  processedAt: string | null;
  adminMemo: string | null;
  createdAt: string;
};

/* 신고 상태 변경 */
type ReportAction =
  | "SANCTION" // 제재
  | "NO_ACTION" // 조치 없음
  | "WARN" // 경고
  | "ETC" // 기타
  | string;

type UpdateReportStatusParams = {
  reportId: number;
  status: ReportStatus;
  action: string;
  processMemo?: string | null;
  sanctionUntil?: string | null;
};

type UpdateReportStatusResponse = {
  id: number;
  status: string;
  action: string;
  processedBy: number;
  processedAt: string;
  processMemo: string | null;
};
