"use client";

import DivBox from "../DivBox";
import { useEffect, useState } from "react";
import { getMeDetail, type MemberMeDetail } from "@/lib/api/members/members";

export default function Profile({
  mode,
  onClick,
}: {
  mode: string;
  onClick?: () => void;
}) {
  const [me, setMe] = useState<MemberMeDetail | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getMeDetail();
        if (!mounted) return;
        setMe(data);
      } catch {
        
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const displayName =
    mode === "admin" ? "관리자" : me?.name ?? "홍길동";

  // 스웨거상 email 필드가 없어서 userId를 표시용으로 사용(대부분 이메일 아이디일 확률)
  const displayEmail =
    mode === "admin" ? "admin@dear.com" : me?.userId ?? "hong@mail.com";

  const firstChar =
    mode === "admin" ? "A" : (me?.name?.[0] ?? "홍");

  return (
    <>
      <button type="button" onClick={onClick} className="w-full text-left">
        <DivBox className="border-2">
          <div className="flex items-center gap-3">
            <div className="bg-text w-14 h-14 rounded-full">
              <div className="text-white text-xl h-full flex items-center justify-center">
                {firstChar}
              </div>
            </div>
            <div>
              <p>{displayName}</p>
              <p className="text-text-3 text-sm line-clamp-2">
                {displayEmail}
              </p>
            </div>
          </div>
        </DivBox>
      </button>
    </>
  );
}
