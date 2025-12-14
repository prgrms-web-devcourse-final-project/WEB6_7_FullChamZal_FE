import AdminSidebar from "@/components/dashboard/admin/sidebar/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="relative w-full h-screen flex overflow-hidden">
        <AdminSidebar />
        <section className="flex-1 h-full overflow-y-auto">
          <div className="p-8">{children}</div>
        </section>
      </main>
    </>
  );
}
