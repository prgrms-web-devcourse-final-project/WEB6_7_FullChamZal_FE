"use client";

import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import { Search } from "lucide-react";

type MapListProps = {
  listData?: PublicCapsule[];
  onClick: (id: number, lat: number, lng: number) => void;
  focus: { id: number; ts: number } | null;
};

export default function MapList({ listData, onClick, focus }: MapListProps) {
  //검색 키워드
  const [keyword, setKeyword] = useState("");
  const cardFocus = useRef<Record<number, HTMLButtonElement | null>>({});
  const searchResultList = listData?.filter(
    (d) => d.title.includes(keyword) || d.capsuleLocationName.includes(keyword)
  );

  useEffect(() => {
    if (focus == null) return;

    const target = cardFocus.current[focus.id];
    if (!target) return;

    // 포커스 주기 (접근성 + 키보드 이동)
    target.focus();
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focus]);

  if (listData?.length === 0)
    return (
      <p className="text-center text-text-4 py-8 text-sm">
        주변에 편지가 없습니다.
      </p>
    );

  return (
    <>
      {/* 검색 */}
      <div className="px-6 relative">
        <Search
          size={16}
          className="absolute left-10 top-1/2 -translate-y-1/2 text-text-4"
        />
        <input
          type="text"
          placeholder="장소, 제목으로 검색..."
          value={keyword}
          className="w-full p-2 pl-10 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      {/* 리스트 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6">
        {/* 리스트 1 */}
        {searchResultList?.length === 0 ? (
          <p className="text-center text-text-4 py-8 text-sm">
            일치하는 편지가 없습니다.
          </p>
        ) : (
          searchResultList?.map((d) => (
            <button
              key={d.capsuleId}
              type="button"
              className="group w-full text-left rounded-xl hover:bg-button-hover focus:bg-primary-2"
              onClick={() =>
                onClick(d.capsuleId, d.capsuleLatitude, d.capsuleLongitude)
              }
              ref={(val) => {
                cardFocus.current[d.capsuleId] = val;
              }}
            >
              <Card data={d} keyword={keyword} />
            </button>
          ))
        )}
      </div>
    </>
  );
}
