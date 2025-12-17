import "server-only";
import { apiFetchServer } from "../fetchClientServer";

export const authApiServer = {
  me: () => apiFetchServer<MemberMe>("/api/v1/members/me"),
};
