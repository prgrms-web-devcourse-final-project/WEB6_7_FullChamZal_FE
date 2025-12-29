type TabType = "route" | "map";

interface Props {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export default function TrackTabMenu({ activeTab, onChange }: Props) {
  const tabs = [
    { key: "route", label: "경로" },
    { key: "map", label: "지도" },
  ] as const;

  return (
    <div className="w-full flex border-b border-outline">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`cursor-pointer flex-1 py-4  text-center border-b-2 transition
            ${
              activeTab === tab.key
                ? "border-primary-2 text-primary-2"
                : "border-transparent text-text-4 hover:bg-button-hover"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
