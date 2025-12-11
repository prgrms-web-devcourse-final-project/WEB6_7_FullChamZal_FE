import { Send } from "lucide-react";
import DivBox from "../../DivBox";

export default function SendPage() {
  return (
    <>
      <section className="flex-1 w-full">
        <div className="p-8">
          <DivBox>
            <div className="flex items-center gap-4">
              <Send className="text-primary" />
              <div>
                <p className="text-lg">
                  보낸 편지<span className="text-primary px-1">_</span>
                </p>
                <p className="text-sm text-text-3">
                  <span className="text-primary font-semibold">4통</span>의 편지
                </p>
              </div>
            </div>
          </DivBox>
        </div>
      </section>
    </>
  );
}
