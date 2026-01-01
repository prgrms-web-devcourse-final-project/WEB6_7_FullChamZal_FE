"use client";

import { useState } from "react";
import AdminSidebar from "@/components/dashboard/admin/sidebar/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* 모바일 헤더 */}
      <header className="lg:hidden h-14 border-b border-outline flex items-center px-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="cursor-pointer p-2 rounded-lg hover:bg-button-hover"
          aria-label="메뉴 열기"
        >
          <Menu size={20} />
        </button>

        <div className="ml-2 font-semibold">Admin Dashboard</div>
      </header>

      <main className="relative w-full h-screen flex overflow-hidden">
        <AdminSidebar
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        <section className="flex-1 h-full overflow-x-hidden overflow-y-auto">
          <div className="p-8">{children}</div>
        </section>
      </main>
    </>
  );
}
