import React from "react";

export default function WriteDiv({
  title,
  warning,
  children,
}: {
  title: string;
  warning?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full p-5 bg-white/80 border border-outline rounded-xl">
        <div className="flex md:items-center flex-col md:flex-row gap-2">
          <span>{title}</span>
          <span className="text-text-4 text-sm">{warning}</span>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </>
  );
}
