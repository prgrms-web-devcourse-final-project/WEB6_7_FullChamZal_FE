import React from "react";

export default function WriteDiv({
  title,
  warning,
  children,
}: {
  title: React.ReactNode;
  warning?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full p-4 md:p-5 bg-white/80 border border-outline rounded-xl">
        <div className="flex md:items-center flex-col md:flex-row gap-2">
          {typeof title === "string" ? <span>{title}</span> : title}
          <span className="text-text-4 text-xs md:text-sm">{warning}</span>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </>
  );
}
