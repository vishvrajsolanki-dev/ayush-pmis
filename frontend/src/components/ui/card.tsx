import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | string;
}

export function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddingClass =
    padding === "none"
      ? "p-0"
      : padding === "sm"
      ? "p-3"
      : padding === "lg"
      ? "p-6"
      : "p-5";

  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-container-highest pb-3 mb-4">
      <div>
        <h3 className="text-base font-bold text-on-surface">{title}</h3>
        {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
