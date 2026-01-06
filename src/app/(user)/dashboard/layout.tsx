import { requireCapsuleUser } from "@/lib/hooks/guards";
import DashboardShell from "../../../components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 가드 훅
  const me = await requireCapsuleUser();

  return <DashboardShell me={me}>{children}</DashboardShell>;
}
