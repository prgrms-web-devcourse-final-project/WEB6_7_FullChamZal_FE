/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getAdminUsers, AdminStatus } from "@/lib/api/admin/users/adminUsers";

function mapTabToFilters(tab: string): {
  status?: AdminStatus;
} {
  if (tab === "active") return { status: "ACTIVE" };
  if (tab === "stop") return { status: "STOP" }; // ✅ UI 탭 key = stop
  return {}; // all
}

type State = {
  users: AdminUser[];
  totalElements: number;
  loading: boolean;
  error: string | null;

  page: number;
  size: number;

  requestId: number;

  setPage: (page: number) => void;
  resetPage: () => void;

  fetchUsers: (params: { tab: string; query: string }) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
};

export const useAdminUsersStore = create<State>()(
  immer((set, get) => ({
    users: [],
    totalElements: 0,
    loading: false,
    error: null,

    page: 0,
    size: 20,

    requestId: 0,

    setPage: (page) =>
      set((s) => {
        s.page = page;
      }),

    resetPage: () =>
      set((s) => {
        s.page = 0;
      }),

    fetchUsers: async ({ tab, query }) => {
      const { page, size } = get();
      const filters = mapTabToFilters(tab);

      const nextId = get().requestId + 1;
      set((s) => {
        s.requestId = nextId;
        s.loading = true;
        s.error = null;
      });

      try {
        const res = await getAdminUsers({
          page,
          size,
          query,
          ...filters, // ✅ status를 “객체로” 넣지 말고 spread
        });

        if (get().requestId !== nextId) return;

        set((s) => {
          s.users = res.data.content;
          s.totalElements = res.data.totalElements;
        });
      } catch (e: any) {
        if (get().requestId !== nextId) return;

        set((s) => {
          s.users = [];
          s.totalElements = 0;
          s.error = e?.message ?? "회원 목록을 불러오지 못했습니다.";
        });
      } finally {
        if (get().requestId !== nextId) return;
        set((s) => {
          s.loading = false;
        });
      }
    },

    toggleStatus: async (id: number) => {
      const prevUsers = get().users;
      const target = prevUsers.find((u) => u.id === id);
      if (!target) return;

      const prevStatus = target.status;
      const nextStatus: AdminStatus =
        prevStatus === "ACTIVE" ? "STOP" : "ACTIVE";

      set((s) => {
        const u = s.users.find((x) => x.id === id);
        if (u) u.status = nextStatus;
      });

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/members/${id}/status`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status: nextStatus }),
          }
        );

        if (!res.ok) throw new Error("상태 변경 실패");
      } catch (e) {
        set((s) => {
          const u = s.users.find((x) => x.id === id);
          if (u) u.status = prevStatus;
        });
        throw e;
      }
    },
  }))
);
