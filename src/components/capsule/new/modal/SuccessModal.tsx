import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Check } from "lucide-react";

export default function SuccessModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-[420px] flex flex-col items-center gap-4 rounded-2xl border-2 border-outline bg-white p-6">
        <div className="w-16 h-16 rounded-full bg-sub flex items-center justify-center">
          <Check size={32} strokeWidth={1} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base md:text-lg">편지 생성 완료</p>
          <p className="text-text-2 text-sm">성공적으로 편지가 생성되었습니다.</p>
        </div>
        <Button
          className="w-full py-2 md:py-3 text-sm md:text-base"
          onClick={onConfirm}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
}

