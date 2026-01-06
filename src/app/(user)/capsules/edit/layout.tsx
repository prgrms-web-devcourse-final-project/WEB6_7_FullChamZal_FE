import { requireCapsuleUser } from "@/lib/hooks/guards";

export default async function CapsulesEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 가드 훅
  await requireCapsuleUser();

  return <>{children}</>;
}
