type AdminStatus = "ACTIVE" | "STOP";

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
