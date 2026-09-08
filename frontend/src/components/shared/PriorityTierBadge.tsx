import React from "react";
import { PriorityTier, SignalSource } from "@/lib/types/enums";

interface PriorityTierBadgeProps {
  tier: PriorityTier;
  source?: SignalSource;
  score?: number;
}

export function PriorityTierBadge({ tier, source, score }: PriorityTierBadgeProps) {
  const tierColor = {
    [PriorityTier.HIGH]: "bg-emerald-100 text-emerald-800 border-emerald-300",
    [PriorityTier.MEDIUM]: "bg-blue-100 text-blue-800 border-blue-300",
    [PriorityTier.LOW]: "bg-slate-100 text-slate-800 border-slate-300",
  }[tier];

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${tierColor}`}>
        Priority Tier: {tier}
      </span>
      {source && (
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
            source === SignalSource.ML
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
          title={
            source === SignalSource.ML
              ? "Opportunity-side signal computed via trained ML model (VALIDATION gate passed)"
              : "Opportunity-side signal computed via deterministic heuristic fallback"
          }
        >
          {source === SignalSource.ML ? "Signal: Model" : "Signal: Fallback"}
        </span>
      )}
    </div>
  );
}
