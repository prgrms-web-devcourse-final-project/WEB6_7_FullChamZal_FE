import { apiFetch } from "../../fetchClient";

export type AdminStatus = "ACTIVE" | "STOP";

function mapTabToFilters(tab: string): { status?: AdminStatus } {
  if (tab === "active") return { status: "ACTIVE" };
  if (tab === "stop") return { status: "STOP" };
  return {};
}

export type AdminUsersSummary = {
  total: number;
  active: number;
  stop: number;
  reported: number;
};

export type AdminUsersResponse = {
  content: AdminUser[];
  totalElements: number;
  summary?: AdminUsersSummary;
};

export async function fetchAdminUsers(params: {
  tab: string;
  query: string;
  page: number;
  size: number;
  signal?: AbortSignal;
}) {
  const filters = mapTabToFilters(params.tab);

  const qs = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    query: params.query ?? "",
    ...(filters.status ? { status: filters.status } : {}),
  });

  return apiFetch<AdminUsersResponse>(
    `/api/v1/admin/members?${qs.toString()}`,
    { signal: params.signal }
  );
}

export async function toggleAdminUserStatus(params: {
  id: number;
  nextStatus: AdminStatus;
}) {
  return apiFetch<void>(`/api/v1/admin/members/${params.id}/status`, {
    method: "PATCH",
    json: { status: params.nextStatus },
  });
}
