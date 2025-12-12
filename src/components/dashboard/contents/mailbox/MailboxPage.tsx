import DivBox from "../../DivBox";
import EnvelopeCard from "./EnvelopeCard";
import { JSX } from "react";

export default function MailboxPage({
  icon,
  title,
}: {
  icon: JSX.Element;
  title: string;
}) {
  return (
    <>
      <section className="flex-1 w-full">
        <div className="p-8">
          <DivBox className="cursor-auto hover:bg-white space-y-12">
            <div className="flex items-center gap-4">
              <div className="text-primary">{icon}</div>
              <div>
                <p className="text-lg">
                  {title}
                  <span className="text-primary px-1">_</span>
                </p>
                <p className="text-sm text-text-3">
                  <span className="text-primary font-semibold">4통</span>의 편지
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between">
              {/* 편지 */}
              <EnvelopeCard />
              <EnvelopeCard />
              <EnvelopeCard />
              <EnvelopeCard />
              <EnvelopeCard />
              <EnvelopeCard />
            </div>
          </DivBox>
        </div>
      </section>
    </>
  );
}
