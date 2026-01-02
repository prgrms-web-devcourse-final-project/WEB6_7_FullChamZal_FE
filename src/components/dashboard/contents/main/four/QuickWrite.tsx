"use client";

import { Clock, Globe, PencilLine, Sparkles } from "lucide-react";
import DivBox from "../../../DivBox";
import { useRouter } from "next/navigation";

const TEMPLATES: {
  id: TemplateId;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accentClass: string;
  bgClass: string;
  ringClass: string;
}[] = [
  {
    id: "future-me",
    title: "미래의 나에게",
    desc: "지금으로부터 1년 뒤, 다시 만나볼 편지",
    icon: <Clock className="w-5 h-5" />,
    accentClass: "text-primary",
    bgClass: "bg-primary/5",
    ringClass: "hover:ring-primary/30",
  },
  {
    id: "thanks",
    title: "감사 · 칭찬 편지",
    desc: "고마웠던 마음을 솔직하게 전해보세요",
    icon: <Sparkles className="w-5 h-5" />,
    accentClass: "text-emerald-600",
    bgClass: "bg-emerald-500/10",
    ringClass: "hover:ring-emerald-500/30",
  },
  {
    id: "public",
    title: "공개 편지 작성하기",
    desc: "세상에 들려주고 싶은 이야기를 적어보세요",
    icon: <Globe className="w-5 h-5" />,
    accentClass: "text-indigo-600",
    bgClass: "bg-indigo-500/10",
    ringClass: "hover:ring-indigo-500/30",
  },
];

export default function QuickWrite() {
  const router = useRouter();

  const goNew = (template?: TemplateId) => {
    const url = template
      ? `/capsules/new?template=${template}`
      : "/capsules/new";
    router.push(url);
  };

  return (
    <DivBox className="cursor-auto hover:bg-sub/0">
      <div className="space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3">
          <PencilLine className="text-primary" />
          <div>
            <p className="text-lg">빠른 편지 쓰기</p>
            <p className="text-sm text-text-3">템플릿을 선택하여 시작하세요</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {TEMPLATES.map((t) => (
            <DivBox
              key={t.id}
              className={[
                "space-y-4 cursor-pointer transition border-none",
                "ring-1 ring-transparent hover:ring-2",
                t.ringClass,
                t.bgClass,
              ].join(" ")}
              onClick={() => goNew(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && goNew(t.id)}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${t.bgClass}`}
              >
                <span className={t.accentClass}>{t.icon}</span>
              </div>

              <div className="space-y-2">
                <p className="font-medium">{t.title}</p>
                <p className="text-sm text-text-3">{t.desc}</p>
              </div>
            </DivBox>
          ))}
        </div>

        <DivBox
          className="py-4 flex items-center justify-center gap-4 hover:bg-sub cursor-pointer"
          onClick={() => goNew()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && goNew()}
        >
          <PencilLine size={20} />
          <span>빈 편지지로 시작하기</span>
        </DivBox>
      </div>
    </DivBox>
  );
}
