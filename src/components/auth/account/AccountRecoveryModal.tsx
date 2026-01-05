"use client";

import Modal from "@/components/common/modal/Modal";
import { X } from "lucide-react";
import AccountRecoveryContent from "./AccountRecoveryContent";

type Mode = "FIND_ID" | "FIND_PW";

export default function AccountRecoveryModal({
  open,
  onClose,
  initialMode = "FIND_PW",
  initialUserId,
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
  initialUserId?: string;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-xl rounded-2xl border-2 border-outline bg-bg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="py-4 px-6 flex justify-between items-center border-b border-outline">
          <h4 className="text-lg">
            {initialMode === "FIND_ID" ? "아이디 찾기" : "비밀번호 재설정"}
          </h4>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        <AccountRecoveryContent
          initialMode={initialMode}
          initialUserId={initialUserId}
          onDone={onClose}
        />
      </div>
    </Modal>
  );
}
