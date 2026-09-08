import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-on-surface mb-1">{label}</label>}
      <input
        className={`w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary focus:border-primary transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
