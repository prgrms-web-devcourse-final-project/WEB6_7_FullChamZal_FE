"use client";
import { useState } from "react";
import Card from "./Card";
import { Search } from "lucide-react";

type MapListProps = {
  listData?: PublicCapsule[];
};

export default function MapList({ listData }: MapListProps) {
  //검색 키워드
  const [keyword, setKeyword] = useState("");

  listData?.filter((d) => d.title.includes(keyword));
  if (listData?.length === 0) return <p>주변에 편지가 없습니다.</p>;
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
        {listData?.map((d) => (
          <Card key={d.capsuleId} data={d} />
        ))}
      </div>
    </>
  );
}
