import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";

const CAPSULE_TABS = [
  { key: "all", label: "전체" },
  { key: "public", label: "공개" },
  { key: "private", label: "비공개" },
  { key: "locked", label: "잠긴 캡슐" },
  { key: "opened", label: "열린 캡슐" },
] as const;

export default function CapsuleSection() {
  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="캡슐 관리"
          content="전체 캡슐을 조회하고 관리할 수 있습니다"
        />

        <StatsOverview tabs={CAPSULE_TABS} />

        <AdminBody
          section="capsules"
          tabs={CAPSULE_TABS}
          defaultTab="all"
          searchPlaceholder="캡슐 제목 또는 작성자로 검색..."
        />
      </div>
    </>
  );
}
