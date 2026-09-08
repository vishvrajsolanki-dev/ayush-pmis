import React from "react";
import { AllocationRunStatus } from "@/lib/types/enums";

interface GovernanceStatusBadgeProps {
  status: AllocationRunStatus | string;
  className?: string;
}

export function GovernanceStatusBadge({ status, className = "" }: GovernanceStatusBadgeProps) {
  const styles: Record<string, string> = {
    [AllocationRunStatus.DRAFT]: "bg-slate-100 text-slate-700 border-slate-300",
    [AllocationRunStatus.PROPOSED]: "bg-blue-100 text-blue-800 border-blue-300",
    [AllocationRunStatus.UNDER_REVIEW]: "bg-amber-100 text-amber-800 border-amber-300",
    [AllocationRunStatus.APPROVED]: "bg-teal-100 text-teal-800 border-teal-300",
    [AllocationRunStatus.OVERRIDDEN]: "bg-purple-100 text-purple-800 border-purple-300",
    [AllocationRunStatus.INVALIDATED]: "bg-rose-100 text-rose-800 border-rose-300 font-semibold",
    [AllocationRunStatus.PUBLISHED]: "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
  };

  const currentStyle = styles[status] || "bg-slate-100 text-slate-700 border-slate-300";
  const displayLabel = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}
    >
      {displayLabel}
    </span>
  );
}
