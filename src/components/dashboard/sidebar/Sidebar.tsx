import { LogOut } from "lucide-react";
import Logo from "../../common/Logo";
import MenuTab from "./MenuTab";
import MyMailbox from "./MyMailbox";
import Profile from "./Profile";

export default function Sidebar() {
  return (
    <>
      <aside className="w-72 h-full border-r border-outline hidden lg:flex flex-col justify-between p-6">
        <div className="space-y-9">
          {/* 로고 */}
          <div className="flex items-center gap-2">
            <Logo className="w-9" />
            <span className="text-primary text-2xl font-paperozi font-extrabold">
              Dear. ___
            </span>
          </div>
          {/* 프로필 */}
          <Profile />
          {/* 메뉴(홈, 지도) */}
          <MenuTab />
          {/* 나의 우체통 */}
          <MyMailbox />
        </div>

        <button className="cursor-pointer text-primary flex items-center justify-center gap-2 text-sm">
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </aside>
    </>
  );
}
