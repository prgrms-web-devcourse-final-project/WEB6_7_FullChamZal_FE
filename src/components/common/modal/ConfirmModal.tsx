import Modal from "@/components/common/modal/Modal";
import Button from "@/components/common/tag/Button";
import { Check, X } from "lucide-react";

export default function ConfirmModal({
  active,
  title,
  content,
  open,
  onClose,
  onConfirm,
}: {
  active: "success" | "fail";
  title: string;
  content: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      zIndexClassName="z-[20000]"
      closeOnOverlayClick={true}
    >
      <div className="w-full flex flex-col items-center gap-4 rounded-2xl border-2 border-outline bg-bg p-6">
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
        <div className="w-full flex gap-2">
          <Button
            type="button"
            className="flex-1 py-2 md:py-3 text-sm md:text-base border border-outline bg-bg text-text hover:bg-button-hover"
            onClick={onClose}
          >
            아니오
          </Button>
          <Button
            type="button"
            className="flex-1 py-2 md:py-3 text-sm md:text-base"
            onClick={onConfirm}
          >
            예
          </Button>
        </div>
      </div>
    </Modal>
  );
}
