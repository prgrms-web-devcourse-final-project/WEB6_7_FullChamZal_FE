import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Check, X } from "lucide-react";

export default function ActiveModal({
  active,
  title,
  content,
  open,
  onClose,
  onConfirm = onClose,
}: {
  active: "success" | "fail";
  title: string;
  content: string;
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} zIndexClassName="z-[20000]">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-105 flex flex-col items-center gap-4 rounded-2xl border-2 border-outline bg-white p-6">
          <div className="w-16 h-16 rounded-full bg-sub flex items-center justify-center">
            {active === "fail" ? (
              <X size={32} strokeWidth={1} />
            ) : (
              <Check size={32} strokeWidth={1} />
            )}
          </div>
          <div className="text-center space-y-1">
            <p className="text-base md:text-lg">{title}</p>
            <p className="text-text-2 text-sm">{content}</p>
          </div>
          <Button
            className="w-full py-2 md:py-3 text-sm md:text-base"
            onClick={onConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
