import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string; // 추가로 받을 스타일
};

export default function Button({ className, children, ...props }: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-colors cursor-pointer " +
    "bg-[#FF2600] hover:bg-[#e32200] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button className={twMerge(baseClass, className)} {...props}>
      {children}
    </button>
  );
}
