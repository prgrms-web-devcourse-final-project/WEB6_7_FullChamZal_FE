import { useEffect } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

async function copyWithClipboardAPI(text: string) {
  if (!text.trim()) return;
  try {
    if (!navigator.clipboard || !window.isSecureContext) {
      throw new Error("Clipboard API not available");
    }
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Clipboard copy failed", error);
    toast.error("클립보드 복사에 실패했습니다. 브라우저 설정을 확인해 주세요.");
  }
}

export default function CopyTemplate({
  open,
  onClose,
  onConfirm,
  data,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  data: { userName: string; url: string; password?: string } | null;
}) {
  // 복사할 메시지
  const shareText = `[Dear.___] 편지 전송 안내
${
  data?.userName ?? ""
}님으로부터 편지가 도착했습니다. 아래의 링크를 통해 편지 세부 내용을 확인하실 수 있습니다.

접속 URL: ${data?.url ?? ""}
${data?.password ? `비밀번호: ${data.password}` : ""}

※ 편지 내용을 저장하거나 보관함에 추가하시려면 로그인이 필요합니다.

궁금한 점이 있으시면 Dear.___ 고객센터로 문의해주세요.
감사합니다.`;

  // Clipboard API 사용
  const copyToClipboard = async () => {
    await copyWithClipboardAPI(shareText);
    toast.success("클립보드 복사에 성공했습니다!");
  };

  useEffect(() => {
    if (open && data?.userName) {
      void copyWithClipboardAPI(shareText);
    }
  }, [open, data?.userName, data?.url, data?.password, shareText]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-130 flex flex-col items-center gap-3 md:gap-5 rounded-2xl border-2 border-outline bg-bg p-4 md:p-6">
        <div className="w-20 h-20 rounded-full bg-sub flex items-center justify-center">
          <Check size={40} strokeWidth={1} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base md:text-xl">편지 생성 완료</p>
          <p className="text-text-2 text-sm md:text-base">
            공유 메시지를 복사하세요.
            {/* 공유 메시지가 클립보드에 저장되었습니다. */}
          </p>
        </div>
        <div className="border border-outline p-6 bg-sub rounded-xl">
          <pre className="text-text-4 text-sm md:text-base whitespace-pre-wrap break-keep">
            {shareText}
          </pre>
        </div>
        <div className="w-full flex gap-4">
          <Button
            className="w-full py-1.5 md:py-3 text-text bg-bg border-2 border-primary-3 text-sm md:text-base md:font-normal hover:text-white hover:border-primary-2"
            onClick={copyToClipboard}
          >
            클립보드 복사
          </Button>
          <Button
            className="w-full py-1.5 md:py-3 text-sm md:text-base"
            onClick={onConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
