import "server-only";
import { apiFetchServer } from "../fetchServer";

export const authApiServer = {
  me: () => apiFetchServer<MemberMe>("/api/v1/members/me"),
};
