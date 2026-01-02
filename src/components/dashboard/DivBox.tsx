import { twMerge } from "tailwind-merge";
import React from "react";

export type DivBoxProps = React.HTMLAttributes<HTMLDivElement>;

export default function DivBox({ className, ...props }: DivBoxProps) {
  const baseClass =
    "cursor-pointer w-full p-6 border border-outline rounded-2xl";

  return <div className={twMerge(baseClass, className)} {...props} />;
}
