"use client";

import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "../api/auth/auth.client";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: ({ signal }) => authApiClient.me(signal),
    retry: false,
    staleTime: 60_000,
  });
}
