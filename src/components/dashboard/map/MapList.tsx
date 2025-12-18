"use client";
import { useState } from "react";
import Card from "./Card";
import { Search } from "lucide-react";

type MapListProps = {
  listData?: PublicCapsule[];
  onClick: (lat: number, lng: number) => void;
};

export default function MapList({ listData, onClick }: MapListProps) {
  //검색 키워드
  const [keyword, setKeyword] = useState("");
  const searchResultList = listData?.filter((d) => d.title.includes(keyword));

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
              className="w-full text-left"
              onClick={() => onClick(d.capsuleLatitude, d.capsuleLongitude)}
            >
              <Card key={d.capsuleId} data={d} keyword={keyword} />
            </button>
          ))
        )}
      </div>
    </>
  );
}
