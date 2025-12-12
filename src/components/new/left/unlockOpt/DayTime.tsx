import { Clock } from "lucide-react";

export default function DayTime({
  value,
  onChange,
}: {
  value: DayForm;
  onChange: (v: DayForm) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-1">
        <Clock size={16} />
        <span className="text-sm">시간 설정</span>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="unlock-date">날짜</label>
        <input
          type="date"
          name="unlockDate"
          id="unlock-date"
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
          className="bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="unlock-time">시간</label>
        <input
          type="time"
          name="unlockTime"
          id="unlock-time"
          value={value.time}
          onChange={(e) => onChange({ ...value, time: e.target.value })}
          className="bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
        />
      </div>
    </>
  );
}
