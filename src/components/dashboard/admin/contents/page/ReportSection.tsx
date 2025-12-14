import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";

const REPORT_TABS = [
  { key: "all", label: "전체" },
  { key: "approved", label: "승인됨" },
  { key: "rejected", label: "반려됨" },
  { key: "pending", label: "대기 중" },
] as const;

export default function ReportSection() {
  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="신고 관리"
          content="신고된 사용자와 캡슐을 관리할 수 있습니다"
        />

        <StatsOverview tabs={REPORT_TABS} />

        <AdminBody
          section="reports"
          tabs={REPORT_TABS}
          defaultTab="all"
          searchPlaceholder="신고자 이름 또는 캡슐 아이디로 검색..."
        />
      </div>
    </>
  );
}
