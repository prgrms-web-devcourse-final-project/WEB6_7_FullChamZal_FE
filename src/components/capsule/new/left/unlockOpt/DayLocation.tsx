import DayTime from "./DayTime";
import Location from "./Location";

export default function DayLocation({
  visibility,
  isExpire,
  onIsExpireChange,
  dayValue,
  onDayChange,
  locationValue,
  onLocationChange,
  expireDayValue,
  onExpireDayChange,
}: {
  visibility: Visibility;
  isExpire: boolean;
  onIsExpireChange: () => void;
  dayValue: DayForm;
  onDayChange: (v: DayForm) => void;
  expireDayValue: DayForm;
  onExpireDayChange: (v: DayForm) => void;
  locationValue: LocationForm;
  onLocationChange: (v: LocationForm) => void;
}) {
  return (
    <div className="space-y-4">
      <DayTime
        visibility={visibility}
        isExpire={isExpire}
        onIsExpireChange={onIsExpireChange}
        dayValue={dayValue}
        onDayChange={onDayChange}
        expireDayValue={expireDayValue}
        onExpireDayChange={onExpireDayChange}
      />
      <div className="w-full h-px bg-outline"></div>
      <Location value={locationValue} onChange={onLocationChange} />
    </div>
  );
}
