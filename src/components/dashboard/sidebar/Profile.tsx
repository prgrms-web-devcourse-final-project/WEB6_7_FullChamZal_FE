"use client";

import DivBox from "../DivBox";
import { useEffect, useState } from "react";
import { getMeDetail, type MemberMeDetail } from "@/lib/api/members/members";



export default function Profile({
  mode,
  onClick,
  me: meProp,
}: {
  mode: string;
  onClick?: () => void;
  me?: MemberMeDetail | null;
}) {
  // ✅ props를 state로 복사하지 말기!
  // props가 없을 때만 fetch해서 state로 채움
  const [meFetched, setMeFetched] = useState<MemberMeDetail | null>(null);

  useEffect(() => {
    // 부모에서 me를 내려주면(fetch 불필요)
    if (meProp !== undefined) return;

    let mounted = true;

    (async () => {
      try {
        const data = await getMeDetail();
        if (!mounted) return;
        setMeFetched(data);
      } catch {
        if (!mounted) return;
        setMeFetched(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [meProp]);

  const me = meProp !== undefined ? meProp : meFetched;

  const isAdmin = mode === "admin";

  const displayName = isAdmin ? "관리자" : me?.name ?? "";
  const displayEmail = isAdmin ? "admin@dear.com" : me?.userId ?? "";
  const firstChar = isAdmin ? "A" : me?.name?.[0] ?? "";

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <DivBox className="border-2">
        <div className="flex items-center gap-3">
          <div className="bg-text w-14 h-14 rounded-full">
            <div className="text-white text-xl h-full flex items-center justify-center">
              {firstChar || " "}
            </div>
          </div>

          <div>
            <p>{displayName || "\u00A0"}</p>
            <p className="text-text-3 text-sm line-clamp-2">
              {displayEmail || "\u00A0"}
            </p>
          </div>
        </div>
      </DivBox>
    </button>
  );
}


