type Letter = {
  id: string;
  title: string;
  placeName?: string;
  createdAt?: string;
  lat?: number; // 위치 정보 (지도 마커용)
  lng?: number; // 위치 정보 (지도 마커용)
};

type TrackType = "SEQUENTIAL" | "FREE";

type FirstFormValue = {
  title: string;
  description: string;
  order: TrackType;
  imageFile: File | null;
};

type MemberType = "CREATOR" | "NOT_JOINED" | "PARTICIPANT" | "COMPLETED";

/* 전체 스토리 트랙 리스트 */
type StoryTrackItem = {
  storytrackId: number;
  createrName: string;
  title: string;
  desctiption: string;
  trackType: TrackType;
  isPublic: number;
  price: number;
  totalSteps: number;
  createdAt: string;
  totalMemberCount: number;
  memberType: MemberType;
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

/* 스토리트랙 생성 요청 */
type CreateStorytrackRequest = {
  title: string;
  description: string;
  trackType: TrackType;
  isPublic: number; // 0: 비공개, 1: 공개
  price: number;
  capsuleList: number[]; // capsuleId 배열
};

/* 스토리트랙 생성 응답 */
type CreateStorytrackResponse = {
  storytrackId: number;
  title: string;
  description: string;
  trackType: TrackType;
  isPublic: number;
  price: number;
  totalSteps: number;
  capsuleList: number[]; // capsuleId 배열
};

type ApiEnvelope<T> = {
  code: string;
  message: string;
  data: T;
};

type PageEnvelope<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};

/* 참여한 스토리트랙 리스트 item (participant/joinedList) */
type StoryTrackJoinedItem = {
  memberId: number;
  storytrackId: number;
  creatorNickname: string;
  title: string;
  description: string;
  trackType: TrackType;
  isPublic: 0 | 1;
  price: number;
  totalSteps: number;
  completedSteps: number;
  lastCompletedStep: number;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  totalMemberCount: number;
};

type StoryTrackJoinedListPage = {
  content: StoryTrackJoinedItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};

type StoryTrackJoinedListResponse = ApiResponse<StoryTrackJoinedListPage>;

/* 내가 만든 스토리트랙 리스트 item (creater/storytrackList) */
type StoryTrackMineItem = {
  storytrackId: number;
  title: string;
  description: string;
  trackType: TrackType;
  isPublic: number;
  price: number;
  totalSteps: number;
  createdAt: string;
  totalMemberCount: number;
};

type StoryTrackMineListPage = {
  content: StoryTrackMineItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};

type StoryTrackMineListResponse = ApiResponse<StoryTrackMineListPage>;
