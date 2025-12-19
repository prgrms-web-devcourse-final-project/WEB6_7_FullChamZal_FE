import { apiFetch } from "../fetchClient";

export const capsuleDashboardApi = {
  sendDashboard: (signal?: AbortSignal) =>
    apiFetch<CapsuleDashboardItem[]>("/api/v1/capsule/send/dashboard", {
      signal,
    }),
  receiveDashboard: (signal?: AbortSignal) =>
    apiFetch<CapsuleDashboardItem[]>("/api/v1/capsule/receive/dashboard", {
      signal,
    }),
};
