/* eslint-disable @typescript-eslint/no-explicit-any */
type AdminStatus = "ACTIVE" | "STOP" | "EXIT";

type AdminUser = {
  id: number;
  userId: string;
  nickname: string;
  status: AdminStatus;
  phoneNumber: string;
  reportCount: number;
  blockedCapsuleCount: number;
  capsuleCount: number;
  createdAt: string;
};

type FetchParams = {
  page: number;
  size: number;
  tab: string;
  query: string;
};

type UserListResponse = {
  items: AdminUser[];
  total: number;
  counts: {
    all: number;
    active: number;
    suspended: number;
    reported: number;
  };
};

type AdminUsersSummary = {
  total: number;
  active: number;
  stop: number;
  reported: number;
};

type AdminUsersResponse = {
  content: AdminUser[];
  totalElements: number;
  summary?: AdminUsersSummary;
};

type AdminMemberDetail = {
  id: number;
  userId: string;
  name: string;
  nickname: string;
  status: AdminStatus;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  lastNicknameChangedAt: string | null;

  totalCapsuleCount: number;
  totalReportCount: number;
  totalBookmarkCount: number;
  totalBlockedCapsuleCount: number;
  storyTrackCount: number;

  recentCapsules: Array<{
    id: number;
    title: string;
    status: string; // 필요하면 CapsuleStatus로
    visibility: string; // 필요하면 Visibility로
    createdAt: string;
    openCount: number;
    reportCount: number;
  }>;

  recentNotifications: any[]; // 스키마 확정되면 타입화
  recentPhoneVerifications: Array<{
    id: number;
    purpose: string;
    status: string;
    attemptCount: number;
    createdAt: string;
    expiredAt: string;
    verifiedAt: string;
  }>;
};
