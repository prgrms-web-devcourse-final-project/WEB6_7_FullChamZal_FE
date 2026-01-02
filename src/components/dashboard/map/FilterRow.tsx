import { Check } from "lucide-react";

export default function FilterRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition
        ${active ? "bg-primary/5 text-primary" : "hover:bg-sub text-text-2"}`}
    >
      <span>{label}</span>
      {active && <Check size={16} />}
    </button>
  );
}
