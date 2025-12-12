import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="w-full h-screen flex overflow-hidden">
        <Sidebar />
        {children}
      </main>
    </>
  );
}
