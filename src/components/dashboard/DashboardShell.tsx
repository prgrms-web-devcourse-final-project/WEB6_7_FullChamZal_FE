"use client";

import { useState } from "react";
import OAuthProfileModal from "@/components/auth/OauthProfileModal";
import type { MemberMeDetail } from "@/lib/api/members/members";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardShell({
  children,
  me,
}: {
  children: React.ReactNode;
  me: MemberMeDetail | null;
}) {
  const needs = !me?.nickname || !me?.phoneNumber;
  const [dismissed, setDismissed] = useState(false);
  const openProfileModal = needs && !dismissed;

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

        <div className="ml-2 font-semibold">Dashboard</div>
      </header>

      <main className="relative w-full h-[calc(100vh-56px)] lg:h-screen flex overflow-hidden bg-bg">
        <Sidebar
          me={me}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />
        <section className="flex-1 h-full overflow-y-auto">{children}</section>
      </main>

      {/* 프로필 모달 (기존 유지) */}
      <OAuthProfileModal
        open={openProfileModal}
        onClose={() => setDismissed(true)}
      />
    </>
  );
}
