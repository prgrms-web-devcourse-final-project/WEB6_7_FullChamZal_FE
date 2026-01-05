"use client";

import Modal from "@/components/common/modal/Modal";
import Button from "@/components/common/tag/Button";
import { deleteMe } from "@/lib/api/members/members";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getErrorMessage = (e: unknown) => {
  if (e && typeof e === "object" && "message" in e) {
    return String((e as { message?: unknown }).message ?? "요청 실패");
  }
  return "요청 실패";
};

export default function AccountDeleteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteMe();
      onClose();
      router.replace("/auth/login");
      router.refresh();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-105 rounded-2xl border border-outline bg-bg p-6">
        <div className="space-y-2">
          <h4 className="text-lg text-center">
            정말로 계정을 삭제하시겠습니까?
          </h4>
          <p className="text-xs text-text-3 text-center">
            탈퇴 후에는 서비스 이용 기록과 개인 정보가 삭제됩니다.
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex gap-2">
          <Button
            type="button"
            className="flex-1 py-3 border border-outline bg-bg text-text hover:text-white"
            onClick={onClose}
            disabled={isDeleting}
          >
            아니오
          </Button>
          <Button
            type="button"
            className="flex-1 py-3"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "처리 중..." : "네"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
