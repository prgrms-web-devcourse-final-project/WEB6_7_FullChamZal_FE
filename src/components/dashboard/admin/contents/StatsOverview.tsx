type StatCardConfig = {
  border: string;
  bgFrom: string;
  bgTo: string;
  text: string;
};

const STAT_CARD_STYLES: StatCardConfig[] = [
  {
    border: "border-[#BEDBFF]/50",
    bgFrom: "from-[#EFF6FF]",
    bgTo: "to-[#DBEAFE]",
    text: "text-[#1447E6]",
  },
  {
    border: "border-[#B9F8CF]/50",
    bgFrom: "from-[#F0FDF4]",
    bgTo: "to-[#DCFCE7]",
    text: "text-[#008236]",
  },
  {
    border: "border-[#FFC9C9]/50",
    bgFrom: "from-[#FEF2F2]",
    bgTo: "to-[#FFE2E2]",
    text: "text-[#C10007]",
  },
  {
    border: "border-[#FEE685]/50",
    bgFrom: "from-[#FFFBEB]",
    bgTo: "to-[#FEF3C6]",
    text: "text-[#BB4D00]",
  },
];

export default function StatsOverview({
  tabs,
  totals = 0,
  second = 0,
  third = 0,
  fourth = 0,
}: {
  tabs: readonly TabItem[];
  totals?: number;
  second?: number;
  third?: number;
  fourth?: number;
}) {
  const values = [totals, second, third, fourth];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {values.map((value, idx) => {
        const style = STAT_CARD_STYLES[idx] ?? STAT_CARD_STYLES[0];
        const label = tabs[idx]?.label ?? `STAT_${idx + 1}`;

        return (
          <div
            key={idx}
            className={[
              "w-full rounded-2xl p-4 md:p-6 border",
              "bg-linear-to-br",
              style.border,
              style.bgFrom,
              style.bgTo,
            ].join(" ")}
          >
            <p className={["text-xs md:text-sm", style.text].join(" ")}>
              {label}
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-[#070d19]">
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
