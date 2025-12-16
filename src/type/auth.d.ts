type AuthMode = "login" | "register";

type MemberRole = "USER" | "ADMIN";

type MemberMe = {
  memberId: number;
  userId: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  status: string;
  role: MemberRole;
  createdAt: string;
};
