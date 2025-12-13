import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export default function Button({ className, children, ...props }: ButtonProps) {
  const baseClass =
    "cursor-pointer inline-flex items-center justify-center rounded-lg md:rounded-xl text-white md:font-semibold bg-primary-3 hover:bg-primary-2 disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg";

  return (
    <button className={twMerge(baseClass, className)} {...props}>
      {children}
    </button>
  );
}
