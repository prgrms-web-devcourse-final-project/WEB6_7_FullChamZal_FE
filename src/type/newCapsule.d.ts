type Visibility = "PRIVATE" | "PUBLIC" | "SELF";

type DayForm = {
  date: string; // "2025-12-12"
  time: string; // "14:30"
};

type LocationForm = {
  query: string; // 사용자가 검색창에 입력한 값
  placeName: string; // 선택된 장소명(최종)
  locationLabel: string; // 사용자가 붙이는 장소 별칭(전송값)
  address?: string; // 선택된 주소(선택)
  lat?: number; // 좌표(선택)
  lng?: number; // 좌표(선택)
};
