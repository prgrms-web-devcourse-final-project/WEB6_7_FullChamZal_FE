import { Send } from "lucide-react";
import DivBox from "../../DivBox";
<<<<<<< HEAD
import SendEnvelopeCard from "./SendEnvelopeCard";
=======
>>>>>>> 3eea960be18699561dff241a825be886b6c4a96d

export default function SendPage() {
  return (
    <>
      <section className="flex-1 w-full">
        <div className="p-8">
<<<<<<< HEAD
          <DivBox className="cursor-auto hover:bg-white space-y-12">
=======
          <DivBox>
>>>>>>> 3eea960be18699561dff241a825be886b6c4a96d
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
<<<<<<< HEAD

            <div className="flex justify-between">
              {/* 편지 */}
              <SendEnvelopeCard />
              <SendEnvelopeCard />
              <SendEnvelopeCard />
              <SendEnvelopeCard />
              <SendEnvelopeCard />
            </div>
=======
>>>>>>> 3eea960be18699561dff241a825be886b6c4a96d
          </DivBox>
        </div>
      </section>
    </>
  );
}
