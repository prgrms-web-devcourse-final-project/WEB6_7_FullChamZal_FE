"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth/auth";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: ({ signal }) => authApi.me(signal),
    retry: false,
    staleTime: 60_000,
  });
}
