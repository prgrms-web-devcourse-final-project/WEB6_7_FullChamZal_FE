"use client";

import Button from "@/components/common/Button";
import OverlayModal from "../OverlayModal";

export default function FindIdResultModal({
  open,
  foundUserId,
  onClose,
  onGoLogin,
  onGoFindPw,
}: {
  open: boolean;
  foundUserId: string | null;
  onClose: () => void;
  onGoLogin: () => void;
  onGoFindPw: (userId: string) => void;
}) {
  if (!open || !foundUserId) return null;

  return (
    <OverlayModal open={open} onClose={onClose}>
      <div className="relative w-[92%] max-w-md rounded-2xl border border-outline bg-bg p-6 shadow-2xl">
        <div className="space-y-2">
          <p className="text-lg font-semibold">아이디 조회 완료</p>
          <p className="text-sm text-text-3">
            아래 아이디로 로그인할 수 있어요.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-outline bg-sub p-4 space-y-2">
          <p className="text-xs text-text-3">조회된 아이디</p>
          <p className="text-xl font-medium">{foundUserId}</p>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            className="w-full py-3 border border-outline bg-bg text-text md:font-normal hover:bg-button-hover"
            onClick={onClose}
          >
            닫기
          </Button>

          <Button className="w-full py-3 md:font-normal" onClick={onGoLogin}>
            로그인하러 가기
          </Button>
        </div>

        <div className="mt-3">
          <button
            type="button"
            className="cursor-pointer w-full text-sm underline underline-offset-4 hover:text-text-3"
            onClick={() => onGoFindPw(foundUserId)}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </OverlayModal>
  );
}
