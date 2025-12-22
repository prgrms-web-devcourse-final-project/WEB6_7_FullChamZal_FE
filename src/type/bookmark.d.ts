type BookmarkItem = {
  bookmarkId: number;
  capsuleId: number;
  visibility: string;
  sender: string;
  title: string;
  contentPreview: string;
  isViewed: boolean;
  bookmarkedAt: string;
};

type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};
