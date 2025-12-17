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
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full border border-[#BEDBFF]/50 rounded-2xl p-6 bg-linear-to-br from-[#EFF6FF] to-[#DBEAFE]">
          <p className="text-sm text-[#1447E6]">{tabs[0].label}</p>
          <p className="text-3xl">{totals}</p>
        </div>
        <div className="w-full border border-[#B9F8CF]/50 rounded-2xl p-6 bg-linear-to-br from-[#F0FDF4] to-[#DCFCE7]">
          <p className="text-sm text-[#008236]">{tabs[1].label}</p>
          <p className="text-3xl">{second}</p>
        </div>
        <div className="w-full border border-[#FFC9C9]/50 rounded-2xl p-6 bg-linear-to-br from-[#FEF2F2] to-[#FFE2E2]">
          <p className="text-sm text-[#C10007]">{tabs[2].label}</p>
          <p className="text-3xl">{third}</p>
        </div>
        <div className="w-full border border-[#FEE685]/50 rounded-2xl p-6 bg-linear-to-br from-[#FFFBEB] to-[#FEF3C6]">
          <p className="text-sm text-[#BB4D00]">{tabs[3].label}</p>
          <p className="text-3xl">{fourth}</p>
        </div>
      </div>
    </>
  );
}
