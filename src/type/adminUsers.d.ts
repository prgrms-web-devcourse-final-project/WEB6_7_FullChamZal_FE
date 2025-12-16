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

type GetAdminUsersParams = {
  page?: number;
  size?: number;
  status?: AdminStatus;
  query?: string;
};
