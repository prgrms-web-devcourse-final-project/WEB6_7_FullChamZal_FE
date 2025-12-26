type SortMeta = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

type PageableMeta = {
  pageNumber: number;
  pageSize: number;
  sort: SortMeta;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

type PageResponse<T> = {
  code: string;
  message: string;
  data: {
    content: T[];
    pageable: PageableMeta;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: SortMeta;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
};

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

type CapsuleDashboardSendItem = {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string;
  senderNickname: string;
  title: string;
  content: string;
  createAt: string;
  viewStatus: boolean;
  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  unlockAt: string | null;
  unlockUntil: string | null;
  locationName: string | null;
  locationLat: number | null;
  locationLng: number | null;
  locationRadiusM: number;
  isBookmarked: boolean;
  result: string;
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
