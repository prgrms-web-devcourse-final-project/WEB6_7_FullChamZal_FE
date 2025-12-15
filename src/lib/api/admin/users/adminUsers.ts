export type AdminStatus = "ACTIVE" | "STOP";

export type GetAdminUsersParams = {
  page?: number;
  size?: number;
  status?: AdminStatus;
  query?: string;
};

export async function getAdminUsers(params: GetAdminUsersParams = {}) {
  const { page = 0, size = 20, status, query } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("size", String(size));

  // all이면 status 자체를 보내지 않는다
  if (status) searchParams.set("status", status);

  if (query && query.trim()) searchParams.set("query", query.trim());

  const url = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/api/v1/admin/members?${searchParams.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("회원 목록을 불러올 수 없습니다.");

  return await res.json();
}
