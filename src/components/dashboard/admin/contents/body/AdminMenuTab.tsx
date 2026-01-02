"use client";

export default function AdminMenuTab({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly TabItem[];
  value: string;
  onChange: (tab: string) => void;
}) {
  return (
    <>
      <ul className="flex gap-2 flex-wrap">
        {tabs.map((t) => {
          const isActive = value === t.key;

          return (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => onChange(t.key)}
                className={`cursor-pointer py-2 px-3 md:px-4 rounded-lg border text-xs md:text-base ${
                  isActive
                    ? "bg-admin text-white border-admin"
                    : "border-outline hover:bg-sub"
                }`}
              >
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
