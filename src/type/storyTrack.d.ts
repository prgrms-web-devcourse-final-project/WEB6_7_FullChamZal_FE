type Letter = {
  id: string;
  title: string;
  placeName?: string;
  createdAt?: string;
};

type OrderType = "ordered" | "free";

type FirstFormValue = {
  title: string;
  description: string;
  order: "ordered" | "free";
  imageFile: File | null;
};

/* 전체 스토리 트랙 리스트 */
type StoryTrackItem = {
  storytrackId: number;
  createrName: string;
  title: string;
  desctiption: string;
  trackType: string;
  isPublic: number;
  price: number;
  totalSteps: number;
  totalParticipant: number;
  createdAt: string;
};

type StoryTrackListPage = {
  content: StoryTrackItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};

type StoryTrackListResponse = ApiResponse<StoryTrackListPage>;
