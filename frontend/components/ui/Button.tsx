"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-4 overflow-hidden";
  const animationStyles =
    "hover:-translate-y-0.5 hover:shadow-lg active:scale-95";
  const sizeStyles = "px-6 py-3.5 text-sm md:text-base";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600/30 shadow-blue-600/20",
    secondary:
      "bg-slate-900 text-white hover:bg-black focus:ring-slate-900/30 shadow-slate-900/20",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/30 shadow-red-500/20",
    outline:
      "bg-transparent text-slate-700 border-2 border-slate-200 hover:border-slate-800 hover:text-slate-900 focus:ring-slate-200",
  };

  const currentVariant = variants[variant];
  const disabledStyles =
    "opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-none active:scale-100";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${currentVariant} ${disabled || isLoading ? disabledStyles : animationStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current opacity-70"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
