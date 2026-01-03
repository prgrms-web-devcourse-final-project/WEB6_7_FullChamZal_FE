"use client";

import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { useDeleteStorytrack } from "./useDeleteStoryTrack";

type Props = {
  storytrackId: number;
  redirectTo?: string;
};

export default function DeleteStorytrackButton({
  storytrackId,
  redirectTo = "/storytrack",
}: Props) {
  const router = useRouter();
  const { mutate, isPending } = useDeleteStorytrack();

  const onClickDelete = () => {
    const ok = window.confirm("스토리트랙을 삭제할까요? 삭제하면 되돌릴 수 없습니다.");
    if (!ok) return;

    mutate(storytrackId, {
      onSuccess: () => {
        router.replace(redirectTo);
        router.refresh();
      },
      onError: (err) => {
        alert(
          err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
        );
      },
    });
  };

  return (
    <Button
      type="button"
      onClick={onClickDelete}
      disabled={isPending}
      className="px-4 py-2"
    >
      {isPending ? "삭제 중..." : "삭제"}
    </Button>
  );
}
