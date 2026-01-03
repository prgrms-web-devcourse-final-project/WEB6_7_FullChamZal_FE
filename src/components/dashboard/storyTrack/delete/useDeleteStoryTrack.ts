"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import storyTrackApi from "@/lib/api/dashboard/storyTrack";

export function useDeleteStorytrack() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (storytrackId: number) => {
      const res = await storyTrackApi.deleteStoryTrack({ storytrackId });
      return res;
    },
    onSuccess: (_res, storytrackId) => {
      qc.invalidateQueries({ queryKey: ["storytrack", "list"] });
      qc.invalidateQueries({ queryKey: ["storytrack", storytrackId] });
    },
  });
}
