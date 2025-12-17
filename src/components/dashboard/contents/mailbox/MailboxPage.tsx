import DivBox from "../../DivBox";
import EnvelopeCard from "./EnvelopeCard";
import { Bookmark, Inbox, Send } from "lucide-react";

export default function MailboxPage({
  type,
}: {
  type: "send" | "receive" | "bookmark";
}) {
  const config = {
    send: {
      title: "보낸 편지",
      icon: <Send />,
    },
    receive: {
      title: "받은 편지",
      icon: <Inbox />,
    },
    bookmark: {
      title: "저장한 편지",
      icon: <Bookmark />,
    },
  }[type];

  return (
    <>
      <section className="flex-1 w-full">
        <div className="p-8">
          <DivBox className="cursor-auto hover:bg-white space-y-12">
            <div className="flex items-center gap-4">
              <div className="text-primary">{config.icon}</div>
              <div>
                <p className="text-lg">
                  {config.title}
                  <span className="text-primary px-1">_</span>
                </p>
                <p className="text-sm text-text-3">
                  <span className="text-primary font-semibold">1통</span>의 편지
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between">
              {/* 편지 */}
              {dummyCapsules.map((capsule) => (
                <EnvelopeCard key={capsule.id} capsule={capsule} type={type} />
              ))}
            </div>
          </DivBox>
        </div>
      </section>
    </>
  );
}
