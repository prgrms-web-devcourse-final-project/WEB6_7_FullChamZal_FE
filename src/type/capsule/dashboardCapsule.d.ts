/* 보낸, 받은 편지 조회 */
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

/* 북마크 */
type BookmarkItem = {
  bookmarkId: number;
  capsuleId: number;
  visibility: "PUBLIC" | "PRIVATE";
  sender: string;
  title: string;
  contentPreview: string;
  isViewed: boolean;
  bookmarkedAt: string;
};

type BookmarkPageResponse = {
  content: BookmarkItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};

/* 보낸 사람 조회 */
