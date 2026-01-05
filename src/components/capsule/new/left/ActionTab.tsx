import { JSX } from "react";

type Tab = {
  id: string;
  tabName: string;
  icon?: JSX.Element;
};

export default function ActionTab({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="w-full bg-sub rounded-full flex items-center gap-2 p-1">
      {tabs.map((tab) => {
        const selected = value === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`cursor-pointer w-full flex items-center justify-center gap-1 rounded-full py-1 transition
              ${
                selected
                  ? "border border-primary bg-bg text-primary"
                  : "text-text-5 hover:text-primary-2 hover:bg-bg"
              }`}
          >
            {tab.icon}
            <span className="text-sm">{tab.tabName}</span>
          </button>
        );
      })}
    </div>
  );
}
