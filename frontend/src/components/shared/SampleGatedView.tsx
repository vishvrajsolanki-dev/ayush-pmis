import React from "react";

interface SampleGatedViewProps {
  sampleSize: number;
  minThreshold?: number;
  children: React.ReactNode;
}

export function SampleGatedView({
  sampleSize,
  minThreshold = 10,
  children,
}: SampleGatedViewProps) {
  if (sampleSize < minThreshold) {
    return (
      <div className="p-8 border border-outline-variant bg-surface-container-low rounded-xl text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
          🔒
        </div>
        <h3 className="text-base font-bold text-on-surface mb-1">
          Data Suppressed — Insufficient Sample Size
        </h3>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Per platform privacy constraints (FR-022), institutional analytics require a cohort of at least {minThreshold} verified candidates. Individual-level records are never surfaced as a fallback.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
