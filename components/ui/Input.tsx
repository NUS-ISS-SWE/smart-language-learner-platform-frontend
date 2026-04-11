import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          error
            ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
            : "border-gray-300 bg-white text-gray-900 placeholder-gray-400",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
