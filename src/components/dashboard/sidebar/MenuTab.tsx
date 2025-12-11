"use client";

import { Home, Map } from "lucide-react";
import DivBox from "../DivBox";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuTab() {
  const pathname = usePathname();

  const isHome = pathname.startsWith("/dashboard") && pathname === "/dashboard";
  const isMap = pathname.startsWith("/dashboard/map");

  const baseBoxClass = "px-5 py-3 rounded-[10px]";
  const activeBoxClass =
    "bg-primary-2 border-primary-2/0 text-white shadow-md hover:bg-primary-2";

  return (
    <div className="space-y-3">
      {/* 홈 */}
      <Link href="/dashboard" className="block">
        <DivBox className={`${baseBoxClass} ${isHome ? activeBoxClass : ""}`}>
          <div className="flex items-center gap-3">
            <Home className={isHome ? "text-white" : "text-primary"} />
            <div>
              <p className={`text-sm ${isHome ? "text-white" : ""}`}>홈</p>
              <p className={`text-xs ${isHome ? "text-white" : ""}`}>
                대시보드
              </p>
            </div>
          </div>
        </DivBox>
      </Link>

      {/* 지도 */}
      <Link href="/dashboard/map" className="block">
        <DivBox className={`${baseBoxClass} ${isMap ? activeBoxClass : ""}`}>
          <div className="flex items-center gap-3">
            <Map className={isMap ? "text-white" : "text-primary"} />
            <div>
              <p className={`text-sm ${isMap ? "text-white" : ""}`}>지도</p>
              <p className={`text-xs ${isMap ? "text-white" : ""}`}>
                공개 편지 찾기
              </p>
            </div>
          </div>
        </DivBox>
      </Link>
    </div>
  );
}
