import { JSX } from "react";

type CardType = {
  title: string;
  contents: string;
  bg: string;
  icon: JSX.Element;
};

export default function Card({
  title,
  contents,
  bg = "#FF2600",
  icon,
}: CardType) {
  return (
    <>
      <div
        className={`relative flex-1 h-120 rounded-2xl`}
        style={{ backgroundColor: bg }}
      >
        <div className="p-8 space-y-4">
          <h4 className="font-bold text-2xl">{title}</h4>
          <p>{contents}</p>
        </div>

        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
          {icon}
        </div>
      </div>
    </>
  );
}
