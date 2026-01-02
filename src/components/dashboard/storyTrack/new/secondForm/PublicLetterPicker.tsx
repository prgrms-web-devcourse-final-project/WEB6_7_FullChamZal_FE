/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import { Search } from "lucide-react";

/**
 * CapsuleDashboardItem을 Letter 타입으로 변환
 */
function toLetter(item: CapsuleDashboardItem): Letter {
  return {
    id: String(item.capsuleId),
    title: item.title,
    placeName: item.locationName ?? undefined,
    createdAt: item.createAt,
    lat: item.locationLat ?? undefined,
    lng: item.locationLng ?? undefined,
  };
}

export default function PublicLetterPicker({
  onSelect,
  selectedIds,
}: {
  onSelect: (letter: Letter) => void;
  selectedIds?: Set<string>;
}) {
  const [q, setQ] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["storytrackCapsuleList"],
    queryFn: ({ signal }) =>
      storyTrackApi.getCapsuleList({ page: 0, size: 100 }, signal),
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return (
      <div className="px-5 py-10 text-center text-text-3 text-sm">
        공개 편지 목록을 불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-5 py-10 text-center text-text-3 text-sm">
        공개 편지 목록을 불러오지 못했습니다.
      </div>
    );
  }

  const letters: Letter[] = data?.data?.content?.map(toLetter) ?? [];

  if (letters.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-text-3 text-sm">
        공개 편지가 없습니다.
      </div>
    );
  }

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return letters;
    return letters.filter((l) => {
      const t = (l.title ?? "").toLowerCase();
      const p = (l.placeName ?? "").toLowerCase();
      return t.includes(keyword) || p.includes(keyword);
    });
  }, [letters, q]);

  return (
    <div className="p-4">
      {/* 검색바 */}
      <div className="sticky top-0 z-10 bg-white pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-outline bg-white px-3 py-2">
          <Search size={16} className="text-text-4" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목/장소로 검색"
            className="w-full bg-transparent outline-none text-sm text-text placeholder:text-text-4"
          />
        </div>
        <div className="mt-2 text-xs text-text-4">총 {filtered.length}개</div>
      </div>

      {/* 리스트 */}
      <ul className="space-y-2">
        {filtered.map((l) => {
          const already = selectedIds?.has(l.id) ?? false;

          return (
            <li key={l.id}>
              <button
                type="button"
                disabled={already}
                onClick={() => onSelect(l)}
                className={[
                  "w-full text-left rounded-xl border-2 border-outline bg-white px-4 py-3",
                  "transition active:scale-[0.99]",
                  already
                    ? "border-primary border opacity-40 cursor-not-allowed"
                    : "hover:bg-button-hover cursor-pointer",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-text line-clamp-1">
                      {l.title}
                    </div>
                    <div className="mt-1 text-xs text-text-4 line-clamp-1">
                      {l.placeName ?? "위치 미지정"}
                    </div>
                  </div>

                  {already ? (
                    <span className="shrink-0 inline-flex items-center rounded-full border border-primary px-2 py-1 text-xs text-primary">
                      추가됨
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center rounded-full border border-outline bg-white px-2 py-1 text-xs text-text-4">
                      선택
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
