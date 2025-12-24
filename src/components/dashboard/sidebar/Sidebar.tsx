"use client";

import { LogOut } from "lucide-react";
import Logo from "../../common/Logo";
import MenuTab from "./menu/MenuTab";
import MyMailbox from "./MyMailbox";
import Profile from "./Profile";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileModal from "./profile/ProfileModal";
import { authApiClient } from "@/lib/api/auth/auth.client";
import type { MemberMeDetail } from "@/lib/api/members/members";

export default function Sidebar({ me }: { me?: MemberMeDetail | null }) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    authApiClient.logout();
    router.push("/");
  };

  return (
    <>
      <aside className="w-72 h-full border-r border-outline hidden lg:flex flex-col justify-between p-6">
        <div className="space-y-9">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-primary">
            <Logo className="w-9" />
            <span className="text-2xl font-paperozi font-extrabold">
              Dear. ___
            </span>
          </div>

          {/* 프로필 */}
          <Profile mode="user" onClick={() => setIsProfileOpen(true)} me={me} />

          {/* 메뉴(홈, 지도) */}
          <MenuTab mode="user" />

          {/* 나의 우체통 */}
          <MyMailbox />
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer text-primary flex items-center justify-center gap-2 text-sm"
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </aside>

      {/* 모달 */}
      <ProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
