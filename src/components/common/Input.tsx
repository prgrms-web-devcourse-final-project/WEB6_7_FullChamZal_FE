import React from "react";

type InputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  error?: string; // 에러 메시지
};

export default function Input({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  children,
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 text-sm md:text-base">
      <label htmlFor={id}>{label}</label>

      <div className="flex gap-2">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`
            flex-1 border-2 px-3 py-2 md:px-4 md:py-3 rounded-xl bg-white/80 outline-none
            ${error ? "border-red-500" : "border-outline"}
            focus:border-primary-3
          `}
        />
        {children}
      </div>

      {/* 에러 메시지 영역 */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
