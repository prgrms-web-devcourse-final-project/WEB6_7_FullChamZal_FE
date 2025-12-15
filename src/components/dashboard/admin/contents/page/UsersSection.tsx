import AdminBody from "../body/AdminBody";
import AdminHeader from "../AdminHeader";
import StatsOverview from "../StatsOverview";

const USER_TABS = [
  { key: "all", label: "전체" },
  { key: "active", label: "활성 사용자" },
  { key: "stop", label: "정지된 사용자" },
  { key: "reported", label: "신고 누적" },
] as const;

export default function UsersSection() {
  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="사용자 관리"
          content="전체 회원을 조회하고 관리할 수 있습니다"
        />

        <StatsOverview tabs={USER_TABS} />

        <AdminBody
          section="users"
          tabs={USER_TABS}
          defaultTab="all"
          searchPlaceholder="이름 또는 이메일로 검색..."
        />
      </div>
    </>
  );
}
