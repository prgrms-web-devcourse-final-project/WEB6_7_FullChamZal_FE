"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";

function toLetter(item: CapsuleDashboardItem): Letter {
  return {
    id: String(item.capsuleId),
    title: item.title,
    placeName: item.locationName ?? undefined,
    createdAt: item.createAt ?? "", // ✅ 방어
    lat: item.locationLat ?? undefined,
    lng: item.locationLng ?? undefined,
  };
}

export default function PublicLetterPicker({
  onSelect,
  selectedIds = [],
}: {
  onSelect: (letter: Letter) => void;
  selectedIds?: string[]; // ✅ Set 금지
}) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["storytrackCapsuleList"],
    queryFn: ({ signal }) =>
      storyTrackApi.getCapsuleList({ page: 0, size: 100 }, signal),
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-center text-text-3 text-sm">
        공개 편지 목록을 불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-8 text-center text-text-3 text-sm">
        공개 편지 목록을 불러오지 못했습니다.
      </div>
    );
  }

  const letters: Letter[] = data?.data?.content?.map(toLetter) ?? [];

  if (letters.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-text-3 text-sm">
        공개 편지가 없습니다.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-outline">
      {letters.map((l) => {
        const already = selectedSet.has(l.id);

        return (
          <li key={l.id}>
            <button
              type="button"
              disabled={already}
              onClick={() => onSelect(l)}
              className={[
                "w-full text-left px-4 py-3 transition",
                already
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-button-hover active:scale-[0.99]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text line-clamp-1">
                    {l.title}
                  </div>
                  <div className="text-xs text-text-4 line-clamp-1">
                    {l.placeName ?? "위치 미지정"}
                  </div>
                </div>

                {already ? (
                  <span className="shrink-0 inline-flex items-center rounded-full border border-outline bg-white px-2 py-1 text-[11px] text-text-3">
                    추가됨
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
