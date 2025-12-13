import Modal from "@/components/common/Modal";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="relative w-full h-screen flex overflow-hidden">
        <Sidebar />
        <section className="flex-1 h-full overflow-y-auto">{children}</section>
      </main>
    </>
  );
}
