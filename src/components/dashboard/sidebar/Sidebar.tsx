"use client";

import { LogOut, Moon, Sun, X } from "lucide-react";
import Logo from "../../common/Logo";
import MenuTab from "./menu/MenuTab";
import MyMailbox from "./MyMailbox";
import Profile from "./Profile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileModal from "./profile/ProfileModal";
import { authApiClient } from "@/lib/api/auth/auth.client";
import type { MemberMeDetail } from "@/lib/api/members/members";
import { useDashboardTheme } from "@/components/common/theme/ThemeProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function Sidebar({
  me,
  mobileOpen = false,
  onMobileClose,
}: {
  me?: MemberMeDetail | null;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useDashboardTheme();

  const handleLogout = async () => {
    try {
      // 1) 진행 중인 요청 먼저 취소
      await queryClient.cancelQueries();

      // 2) 서버 세션 종료(쿠키 삭제/만료)
      await authApiClient.logout();
    } finally {
      // 3) 캐시 완전 초기화
      queryClient.clear();

      // 4) 라우팅 + 서버컴포넌트 갱신
      router.replace("/");
      router.refresh();
    }
  };

  // 모바일에서 열렸을 때 스크롤 막기(선택)
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* 데스크탑 Sidebar */}
      <aside className="w-72 border-r border-outline hidden lg:flex flex-col h-dvh">
        {/* 상단(스크롤 영역) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="space-y-7">
            <div className="flex items-center justify-between gap-2">
              {/* Logo */}
              <div className="flex items-center gap-2 text-primary">
                <Logo className="w-9" />
                <span className="text-2xl font-paperozi font-extrabold">
                  Dear. ___
                </span>
              </div>

              {/* 다크모드 버튼 */}
              <button
                type="button"
                onClick={toggleTheme}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-outline bg-(--color-surface) px-3 py-2 text-sm hover:bg-button-hover"
                aria-label="테마 전환"
              >
                <span className="text-(--color-text)">
                  {theme === "dark" ? <Moon /> : <Sun />}
                </span>
              </button>
            </div>

            <Profile
              mode="user"
              onClick={() => setIsProfileOpen(true)}
              me={me}
            />
            <MenuTab mode="user" />
            <MyMailbox />
          </div>
        </div>

        {/* 하단(고정) */}
        <div className="border-t border-outline flex items-center justify-center h-15 md:h-18">
          <button
            onClick={handleLogout}
            className="cursor-pointer text-primary flex items-center justify-center gap-2 text-sm w-full"
          >
            <LogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 모바일 Drawer */}
      <div className="lg:hidden">
        {/* overlay */}
        <div
          className={`fixed inset-0 z-9998 bg-black/40 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onMobileClose}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-9999 w-72 bg-bg border-r border-outline transition-transform duration-200 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!mobileOpen}
        >
          {/* 전체를 세로 레이아웃 + 높이 고정 */}
          <div className="h-dvh flex flex-col">
            {/* Header (고정) */}
            <div className="shrink-0 p-6 pb-4 border-b border-outline">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Logo className="w-9" />
                  <span className="text-2xl font-paperozi font-extrabold">
                    Dear. ___
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onMobileClose}
                  className="cursor-pointer p-2 rounded-lg hover:bg-button-hover"
                  aria-label="메뉴 닫기"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body (스크롤 영역) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <Profile
                mode="user"
                onClick={() => setIsProfileOpen(true)}
                me={me}
              />
              <MenuTab mode="user" onNavigate={onMobileClose} />
              <MyMailbox onNavigate={onMobileClose} />
            </div>

            {/* Footer (하단 고정) */}
            <div className="shrink-0 p-6 border-t border-outline bg-bg">
              <button
                onClick={handleLogout}
                className="cursor-pointer text-primary flex items-center justify-center gap-2 text-sm w-full"
              >
                <LogOut size={20} />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      <ProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
