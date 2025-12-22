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
