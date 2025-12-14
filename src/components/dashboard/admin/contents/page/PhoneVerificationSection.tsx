import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";

const PHONE_TABS = [
  { key: "all", label: "전체" },
  { key: "success", label: "성공" },
  { key: "fail", label: "실패" },
  { key: "locked", label: "만료" },
] as const;

export default function PhoneVerificationSection() {
  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="전화번호 인증 내역"
          content="전화번호 인증 내역을 시간 순서로 확인할 수 있습니다"
        />

        <StatsOverview tabs={PHONE_TABS} />

        <AdminBody
          section="phone"
          tabs={PHONE_TABS}
          defaultTab="all"
          searchPlaceholder="전화번호 또는 이름으로 검색..."
        />
      </div>
    </>
  );
}
