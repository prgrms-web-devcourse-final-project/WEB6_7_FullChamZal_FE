import Link from "next/link";
import DivBox from "../../DivBox";

export function MenuItemCard({
  item,
  isActive,
  mode,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  mode: Mode;
  onClick?: () => void;
}) {
  const baseBoxClass = "px-5 py-3 rounded-[10px]";
  const activeBoxClass = `shadow-md ${
    mode === "admin"
      ? "bg-admin border-admin/0 hover:bg-admin text-bg"
      : "bg-primary-2 border-primary-2/0 hover:bg-primary-2 text-white"
  }`;
  const Icon = item.icon;

  return (
    <Link href={item.href} onClick={onClick} className="block">
      <DivBox className={`${baseBoxClass} ${isActive ? activeBoxClass : ""}`}>
        <div className="flex items-center gap-3">
          <Icon
            className={
              mode === "admin"
                ? isActive
                  ? "text-bg"
                  : "text-[#172c51]"
                : isActive
                ? "text-white"
                : "text-primary"
            }
          />

          <div>
            <p className={`font-semibold text-sm `}>{item.title}</p>
            <p className={`text-xs`}>{item.desc}</p>
          </div>
        </div>
      </DivBox>
    </Link>
  );
}
