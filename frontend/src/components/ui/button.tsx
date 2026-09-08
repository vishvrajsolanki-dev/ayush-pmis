import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  }[size];

  const variantStyles = {
    primary: "bg-primary text-on-primary hover:bg-primary-container",
    secondary: "bg-secondary text-on-secondary hover:opacity-90",
    outline: "border border-outline text-on-surface hover:bg-surface-container-high",
    danger: "bg-error text-on-error hover:opacity-90",
  }[variant];

  return (
    <button className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
