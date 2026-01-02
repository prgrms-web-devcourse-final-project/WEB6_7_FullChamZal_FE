export function Field({
  label,
  value,
  theme,
  wide,
}: {
  label: string;
  value: string;
  theme: "blue" | "red";
  wide?: boolean;
}) {
  const labelClass = theme === "blue" ? "text-blue-800" : "text-red-800";
  const valueClass = theme === "blue" ? "text-blue-900" : "text-red-900";

  return (
    <div className={`flex flex-col gap-1 ${wide ? "md:col-span-2" : ""}`}>
      <span className={`text-xs md:text-sm ${labelClass}`}>{label}</span>
      <span className={`${valueClass} text-sm md:text-base wrap-break-word`}>
        {value}
      </span>
    </div>
  );
}
