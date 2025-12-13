import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Check } from "lucide-react";

export default function CopyTemplate({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: { userName: string; url: string; password?: string } | null;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-[520px] flex flex-col items-center gap-3 md:gap-5 rounded-2xl border-2 border-outline bg-white p-4 md:p-6">
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
            {`[Dear.___] 편지 전송 안내 \n${
              data?.userName
            }님으로부터 편지가 도착했습니다. 아래의 링크를 통해 편지 세부 내용을 확인하실 수 있습니다.\n
    접속 URL: ${data?.url}
    ${
      data?.password ? `비밀번호: ${data.password}` : ""
    }\n\n※ 편지 내용을 저장하거나 보관함에 추가하시려면 로그인이 필요합니다.\n\n궁금한 점이 있으시면 Dear.___ 고객센터로 문의해주세요.\n감사합니다.`}
          </pre>
        </div>
        <div className="w-full flex gap-4">
          <Button className="w-full py-1.5 md:py-3 text-text bg-white border-2 border-primary-3 text-sm md:text-base md:font-normal hover:text-white hover:border-primary-2">
            클립보드 복사
          </Button>
          <Button className="w-full py-1.5 md:py-3 text-sm md:text-base">
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
