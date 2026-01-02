"use client";

export default function DetailItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={[
          "text-sm truncate",
          mono ? "font-mono text-xs whitespace-nowrap" : "",
        ].join(" ")}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}
