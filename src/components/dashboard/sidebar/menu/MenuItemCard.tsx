import Link from "next/link";
import DivBox from "../../DivBox";

export function MenuItemCard({
  mode,
  item,
  isActive,
}: {
  mode: Mode;
  item: MenuItem;
  isActive: boolean;
}) {
  const baseBoxClass = "px-5 py-3 rounded-[10px]";
  const activeBoxClass = `text-white shadow-md ${
    mode === "admin"
      ? "bg-admin border-admin/0 hover:bg-admin"
      : "bg-primary-2 border-primary-2/0 hover:bg-primary-2"
  }`;
  const Icon = item.icon;

  return (
    <Link href={item.href} className="block">
      <DivBox className={`${baseBoxClass} ${isActive ? activeBoxClass : ""}`}>
        <div className="flex items-center gap-3">
          <Icon
            className={
              isActive
                ? "text-white"
                : mode === "admin"
                ? "text-admin"
                : "text-primary"
            }
          />
          <div>
            <p
              className={`font-semibold text-sm ${
                isActive ? "text-white" : ""
              }`}
            >
              {item.title}
            </p>
            <p className={`text-xs ${isActive ? "text-white" : ""}`}>
              {item.desc}
            </p>
          </div>
        </div>
      </DivBox>
    </Link>
  );
}
