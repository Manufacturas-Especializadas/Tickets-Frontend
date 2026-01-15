import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "outline"
  | "ghost"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
  success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
  info: "bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500",
  light: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
  dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700",
  outline:
    "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
  link: "bg-transparent hover:underline text-blue-600 hover:text-blue-800 p-0 focus:ring-0",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs rounded",
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
  xl: "px-8 py-4 text-lg rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 hover:cursor-pointer";

    const fullWidthClass = fullWidth ? "w-full" : "";

    const buttonClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidthClass,
      className,
    ].join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner size={size} />
            {loadingText && <span className="ml-2">{loadingText}</span>}
            {!loadingText && children}
          </div>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

const Spinner = ({ size }: { size: ButtonSize }) => {
  const spinnerSize = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  }[size];

  return (
    <svg
      className={`animate-spin ${spinnerSize}`}
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
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};
