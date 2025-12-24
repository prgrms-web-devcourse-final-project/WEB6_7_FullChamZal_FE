type ModerationDecision = "PASS" | "ERROR" | "FLAGGED";

type AdminModeration = {
  id: number;
  createdAt: string;
  capsuleId: number;
  actorMemberId: number;
  actionType: number | null;
  decision: ModerationDecision;
  model: string;
  flagged: boolean;
};

type AdminModerationResponse = {
  content: AdminModeration[];
  totalElements: number;
};

type AdminModerationAuditLog = {
  id: number;
  createdAt: string;
  capsuleId: number | null;
  actorMemberId: number;
  actionType: string;
  decision: string;
  model: string;
  flagged: boolean;
  inputHash: string;
  rawResponseJson: string; // JSON 문자열
  errorMessage: string | null;
};

type AdminModerationAuditLogResponse = ApiResponse<AdminModerationAuditLog>;
