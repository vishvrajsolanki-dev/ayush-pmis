import React from "react";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
}) {
  const styles = {
    default: "bg-surface-container-high text-on-surface border-outline-variant",
    success: "bg-emerald-100 text-emerald-800 border-emerald-300",
    warning: "bg-amber-100 text-amber-800 border-amber-300",
    error: "bg-rose-100 text-rose-800 border-rose-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  }[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {children}
    </span>
  );
}
