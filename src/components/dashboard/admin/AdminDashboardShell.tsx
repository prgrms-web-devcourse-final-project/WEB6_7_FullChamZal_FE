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
    <div className="h-dvh overflow-hidden">
      {/* 모바일 헤더 */}
      <header className="lg:hidden h-14 border-b border-outline flex items-center px-4 shrink-0">
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

      {/* header 높이를 제외한 나머지 영역 */}
      <main className="flex h-[calc(100dvh-56px)] lg:h-dvh overflow-hidden">
        <AdminSidebar
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 lg:p-8">{children}</div>
        </section>
      </main>
    </div>
  );
}
