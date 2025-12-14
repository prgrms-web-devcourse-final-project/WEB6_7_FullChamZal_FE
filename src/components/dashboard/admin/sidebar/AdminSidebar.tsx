"use client";

import Logo from "@/components/common/Logo";
import MenuTab from "@/components/dashboard/sidebar/menu/MenuTab";
import Profile from "@/components/dashboard/sidebar/Profile";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    // 로그아웃 로직
    router.push("/");
  };

  return (
    <>
      <aside className="w-72 h-full border-r border-outline hidden lg:flex flex-col justify-between p-6">
        <div className="space-y-9">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-admin">
            <Logo className="w-9" />
            <span className="text-2xl font-paperozi font-extrabold">
              Dear. ___
            </span>
          </div>
          {/* 관리자 프로필 */}
          <Profile mode="admin" />

          {/* 관리자 메뉴 */}
          <MenuTab mode="admin" />
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer text-primary flex items-center justify-center gap-2 text-sm"
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </aside>
    </>
  );
}
