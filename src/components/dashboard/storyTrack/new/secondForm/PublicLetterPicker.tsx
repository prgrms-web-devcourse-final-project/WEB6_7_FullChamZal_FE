"use client";

import { useQuery } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";

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
}: {
  onSelect: (letter: Letter) => void;
}) {
  // 공개 캡슐 목록 조회
  // 캡슐 100개 최대, 100개 이상이 필요하면 무한스크롤 구현 필요
  const { data, isLoading, isError } = useQuery({
    queryKey: ["storytrackCapsuleList"],
    queryFn: ({ signal }) =>
      storyTrackApi.getCapsuleList({ page: 0, size: 100 }, signal),
    staleTime: 1000 * 30, // 30초간 캐시 유지: 이 시간 동안은 API 재호출 없이 캐시된 데이터 사용
  });

  // 로딩 중
  if (isLoading) {
    return (
      <div className="px-4 py-8 text-center text-text-3 text-sm">
        공개 편지 목록을 불러오는 중...
      </div>
    );
  }

  // 에러 발생
  if (isError) {
    return (
      <div className="px-4 py-8 text-center text-text-3 text-sm">
        공개 편지 목록을 불러오지 못했습니다.
      </div>
    );
  }

  // 데이터 변환
  const letters: Letter[] = data?.data?.content?.map(toLetter) ?? [];

  // 빈 목록
  if (letters.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-text-3 text-sm">
        공개 편지가 없습니다.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-outline">
      {letters.map((l) => (
        <li key={l.id}>
          <button
            type="button"
            onClick={() => onSelect(l)}
            className="w-full text-left px-4 py-3 hover:bg-button-hover"
          >
            <div className="text-sm text-text">{l.title}</div>
            <div className="text-xs text-text-4">
              {l.placeName ?? "위치 미지정"}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
