import { Heart, Inbox, MailPlus, Send } from "lucide-react";
import DivBox from "../DivBox";

export default function MyMailbox() {
  return (
    <>
      <div className="space-y-3">
        <p className="font-medium">나의 우체통</p>
        <div className="space-y-4">
          <DivBox className="py-2 rounded-[10px]">
            <div className="flex items-center justify-center gap-2">
              <MailPlus size={20} />
              <span>편지 쓰기</span>
            </div>
          </DivBox>
          <DivBox className="py-4 px-7 rounded-xl">
            <div className="flex items-center gap-6">
              <Send className="text-primary" />
              <div className="flex flex-col gap-1">
                <span className="text-sm text-text-3">보낸 편지</span>
                <span className="text-2xl">24</span>
              </div>
            </div>
          </DivBox>
          <DivBox className="py-4 px-7 rounded-xl">
            <div className="flex items-center gap-6">
              <Inbox className="text-primary" />
              <div className="flex flex-col gap-1">
                <span className="text-sm text-text-3">받은 편지</span>
                <span className="text-2xl">12</span>
              </div>
            </div>
          </DivBox>
          <DivBox className="py-4 px-7 rounded-xl">
            <div className="flex items-center gap-6">
              <Heart className="text-primary" />
              <div className="flex flex-col gap-1">
                <span className="text-sm text-text-3">즐겨찾기</span>
                <span className="text-2xl">12</span>
              </div>
            </div>
          </DivBox>
        </div>
      </div>
    </>
  );
}
