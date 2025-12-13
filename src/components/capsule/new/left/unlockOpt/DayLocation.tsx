import DayTime from "./DayTime";
import Location from "./Location";

export default function DayLocation({
  dayValue,
  onDayChange,
  locationValue,
  onLocationChange,
}: {
  dayValue: DayForm;
  onDayChange: (v: DayForm) => void;
  locationValue: LocationForm;
  onLocationChange: (v: LocationForm) => void;
}) {
  return (
    <div className="space-y-4">
      <DayTime value={dayValue} onChange={onDayChange} />
      <div className="w-full h-px bg-outline"></div>
      <Location value={locationValue} onChange={onLocationChange} />
    </div>
  );
}
