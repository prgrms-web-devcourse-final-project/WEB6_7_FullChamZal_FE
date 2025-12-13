import { JSX } from "react";

export type UnlockTab = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  disabled?: boolean;
};

export default function UnlockConditionTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: UnlockTab[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {tabs.map((tab) => {
        const selected = value === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`cursor-pointer w-full flex flex-col items-center rounded-xl p-4 gap-1.5 border-2 transition
              ${
                tab.disabled
                  ? "opacity-40 cursor-not-allowed border-outline"
                  : selected
                  ? "border-primary bg-primary/5"
                  : "border-outline hover:border-primary/50"
              }`}
          >
            <div
              className={`p-2 rounded-[10px] transition
                ${
                  tab.disabled
                    ? "bg-text-5 text-white"
                    : selected
                    ? "bg-primary text-white"
                    : "bg-text-5 text-white"
                }`}
            >
              {tab.icon}
            </div>

            <p className="text-sm">{tab.title}</p>
            <p className="text-xs text-text-3 text-center">{tab.description}</p>
          </button>
        );
      })}
    </div>
  );
}
