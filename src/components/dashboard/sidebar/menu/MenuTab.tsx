"use client";

import { usePathname } from "next/navigation";
import { FileWarning, Home, Map, Users, Phone } from "lucide-react";
import { MenuItemCard } from "./MenuItemCard";

const ADMIN_ITEMS: MenuItem[] = [
  {
    href: "/admin/dashboard/users",
    activePrefix: "/admin/dashboard/users",
    title: "사용자 관리",
    desc: "회원 조회 및 관리",
    icon: Users,
  },
  {
    href: "/admin/dashboard/capsules",
    activePrefix: "/admin/dashboard/capsules",
    title: "캡슐 관리",
    desc: "전체 캡슐 관리",
    icon: Map,
  },
  {
    href: "/admin/dashboard/reports",
    activePrefix: "/admin/dashboard/reports",
    title: "신고 관리",
    desc: "신고 내역",
    icon: FileWarning,
  },
  {
    href: "/admin/dashboard/phone-verifications",
    activePrefix: "/admin/dashboard/phone-verifications",
    title: "전화번호 인증",
    desc: "인증 내역 확인",
    icon: Phone,
  },
];

const USER_ITEMS: MenuItem[] = [
  {
    href: "/dashboard",
    activePrefix: "/dashboard",
    title: "홈",
    desc: "대시보드",
    icon: Home,
  },
  {
    href: "/dashboard/map",
    activePrefix: "/dashboard/map",
    title: "지도",
    desc: "공개 편지 찾기",
    icon: Map,
  },
];

export default function MenuTab({ mode }: { mode: Mode }) {
  const pathname = usePathname();

  const items = mode === "admin" ? ADMIN_ITEMS : USER_ITEMS;

  return (
    <div className="space-y-3">
      {mode === "admin" && <h3 className="text-text-3 text-sm">관리 메뉴</h3>}

      <div className="space-y-3">
        {items.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.activePrefix);

          return (
            <MenuItemCard
              key={item.href}
              mode={mode}
              item={item}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}
