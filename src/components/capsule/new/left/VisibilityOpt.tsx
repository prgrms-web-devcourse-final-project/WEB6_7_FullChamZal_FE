import { Lock } from "lucide-react";

export default function VisibilityOpt({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  return (
    <div className="flex gap-3">
      <OptionCard
        selected={value === "PRIVATE"}
        onClick={() => onChange("PRIVATE")}
        title="비공개"
        desc="개인 공개"
      />

      <OptionCard
        selected={value === "PUBLIC"}
        onClick={() => onChange("PUBLIC")}
        title="공개"
        desc="모두 공개"
      />
      <OptionCard
        selected={value === "SELF"}
        onClick={() => onChange("SELF")}
        title="내게쓰기"
        desc="나만 보기"
      />
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <div
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`w-full p-4 rounded-xl flex items-center gap-3 cursor-pointer border-2
        ${
          selected
            ? "border-primary bg-primary/5"
            : "border-outline hover:border-primary/50"
        }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center
          ${selected ? "bg-primary text-white" : "bg-text-5 text-white"}`}
      >
        <Lock size={16} />
      </div>

      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-text-3">{desc}</p>
      </div>
    </div>
  );
}
