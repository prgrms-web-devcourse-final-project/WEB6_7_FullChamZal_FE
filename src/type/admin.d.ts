type AdminTab = "all" | "active" | "suspended" | "reported";

type TabItem = { key: string; label: string };

type UserStatus = "active" | "suspended";

type User = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  joinedAt: string;
  sent: number;
  received: number;
  reportCount: number;
  status: UserStatus;
};
