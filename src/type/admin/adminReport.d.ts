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
