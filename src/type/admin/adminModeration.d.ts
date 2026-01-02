type ModerationDecision = "SKIPPED" | "ERROR" | "FLAGGED";

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

/* rawResponseJson 값 타입 */
type ModerationCategory =
  | "harassment"
  | "harassment/threatening"
  | "sexual"
  | "hate"
  | "hate/threatening"
  | "illicit"
  | "illicit/violent"
  | "self-harm/intent"
  | "self-harm/instructions"
  | "self-harm"
  | "sexual/minors"
  | "violence"
  | "violence/graphic";

type ModerationInputType = "text" | "image" | "audio";

type ModerationCategories = Record<ModerationCategory, boolean>;
type ModerationCategoryScores = Record<ModerationCategory, number>;
type ModerationCategoryAppliedInputTypes = Record<
  ModerationCategory,
  ModerationInputType[]
>;

type ModerationResult = {
  flagged: boolean;
  categories: ModerationCategories;
  category_scores: ModerationCategoryScores;
  category_applied_input_types: ModerationCategoryAppliedInputTypes;
};

type ModerationGroup = {
  id: string; // "modr-xxxx"
  model: string; // "omni-moderation-2024-09-26"
  results: ModerationResult[];
};

type ModerationRaw = {
  overall: ModerationGroup;
  byField: Record<string, ModerationGroup>;
};
