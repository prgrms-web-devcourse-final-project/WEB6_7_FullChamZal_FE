import { Clock, Minus, PlusIcon } from "lucide-react";

export default function DayTime({
  visibility,
  isExpire,
  onIsExpireChange,
  dayValue,
  onDayChange,
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
}) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span className="text-sm">열람 가능 시간</span>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="unlock-date">날짜</label>
            <input
              type="date"
              name="unlockDate"
              id="unlock-date"
              value={dayValue.date}
              onChange={(e) =>
                onDayChange({ ...dayValue, date: e.target.value })
              }
              className="bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="unlock-time">시간</label>
            <input
              type="time"
              name="unlockTime"
              id="unlock-time"
              value={dayValue.time}
              onChange={(e) =>
                onDayChange({ ...dayValue, time: e.target.value })
              }
              className="bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
            />
          </div>
        </div>

        {visibility === "SELF" ? (
          ""
        ) : (
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center justify-between "
              onClick={onIsExpireChange}
            >
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span className="text-sm">열람 만료 시간</span>
              </div>
              {isExpire ? <Minus size={16} /> : <PlusIcon size={16}></PlusIcon>}
            </div>
            {isExpire ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="unlock-date">날짜</label>
                  <input
                    type="date"
                    name="unlockDate"
                    id="unlock-date"
                    value={expireDayValue.date}
                    onChange={(e) =>
                      onExpireDayChange({
                        ...expireDayValue,
                        date: e.target.value,
                      })
                    }
                    className="bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="unlock-time">시간</label>
                  <input
                    type="time"
                    name="unlockTime"
                    id="unlock-time"
                    value={expireDayValue.time}
                    onChange={(e) =>
                      onExpireDayChange({
                        ...expireDayValue,
                        time: e.target.value,
                      })
                    }
                    className="bg-sub-2 rounded-lg text-sm p-2 outline-none border border-white/0 focus:border-primary-2"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </>
  );
}
