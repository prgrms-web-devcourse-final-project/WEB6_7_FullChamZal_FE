type ReportReasonType = "SPAM" | "OBSCENITY" | "HATE" | "FRAUD" | "ETC";

type ReportRequest = {
  capsuleId: number;
  reasonType: ReportReasonType;
  reasonDetail: string;
};
