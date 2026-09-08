import React from "react";
import { EvidenceStatus } from "@/lib/types/enums";

interface VerificationStatusPillProps {
  status: EvidenceStatus | string;
  verifierName?: string;
  className?: string;
}

export function VerificationStatusPill({
  status,
  verifierName,
  className = "",
}: VerificationStatusPillProps) {
  if (status === EvidenceStatus.INSTITUTION_VERIFIED || status === "INSTITUTION_VERIFIED" || status === "VERIFIED") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}
        title="Verified by institution account"
      >
        <span className="text-[10px]">✓</span> Verified by institution account
      </span>
    );
  }

  if (status === EvidenceStatus.STALE || status === "STALE") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 ${className}`}
        title="STALE"
      >
        <span className="text-[10px]">⚠️</span> Stale (Re-review Needed)
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 ${className}`}
      title="SELF_REPORTED"
    >
      SELF_REPORTED
    </span>
  );
}
