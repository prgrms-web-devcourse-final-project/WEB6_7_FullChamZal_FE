type CapsuleDashboardItem = {
  capsuleId: number;
  capsuleColor?: string;
  capsulePackingColor?: string;
  recipient?: string;
  sender: string;
  title: string;
  content?: string;
  createAt?: string;
  viewStatus?: boolean;
  unlockType?: string;
  unlockAt?: string | null;
  locationName?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
};

type BookmarkItem = {
  bookmarkId: number;
  capsuleId: number;
  visibility: "PUBLIC" | "PRIVATE"; // 필요하면 확장
  sender: string;
  title: string;
  contentPreview: string;
  isViewed: boolean;
  bookmarkedAt: string; // ISO string
};

type BookmarkPageResponse = {
  content: BookmarkItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};
