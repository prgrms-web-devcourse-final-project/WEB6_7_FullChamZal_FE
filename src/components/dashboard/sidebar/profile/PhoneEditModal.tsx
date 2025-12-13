import Modal from "@/components/common/Modal";
import { X } from "lucide-react";

export default function PhoneEditModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="w-full max-w-[420px] rounded-2xl border border-outline bg-white p-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg">전화번호 수정</h4>
            <button onClick={onClose} className="cursor-pointer">
              <X />
            </button>
          </div>
          <p className="text-sm text-text-3 mt-2">
            여기서 SMS 인증 플로우를 붙이면 좋아요.
          </p>
        </div>
      </Modal>
    </>
  );
}
