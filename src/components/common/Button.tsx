import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export default function Button({ className, children, ...props }: ButtonProps) {
  const baseClass =
    "cursor-pointer inline-flex items-center justify-center rounded-xl px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-3 hover:bg-primary";

  return (
    <button className={twMerge(baseClass, className)} {...props}>
      {children}
    </button>
  );
}
