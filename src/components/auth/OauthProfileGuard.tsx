"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMeDetail } from "@/lib/api/members/members";

export default function OauthProfileGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        const me = await getMeDetail();

        const needNickname = !me.nickname || !me.nickname.trim();
        const needPhone = !me.phoneNumber || !me.phoneNumber.trim();

        // 이미 /auth/profile이면 또 보내지 않기
        if (!alive) return;
        if ((needNickname || needPhone) && pathname !== "/auth/profile") {
          router.replace("/auth/profile");
        }
      } catch {
        // 비로그인 상태면 여기서 처리 안 함(프로젝트 정책에 맞춰서)
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [router, pathname]);

  return null;
}
