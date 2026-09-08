"use client";

import React, { useState } from "react";
import { PriorityTierBadge } from "@/components/shared/PriorityTierBadge";
import { PriorityTier, SignalSource } from "@/lib/types/enums";
import Link from "next/link";

export default function StudentAllocationStatusPage() {
  const [allocationState, setAllocationState] = useState<"MATCHED" | "PENDING" | "UNMATCHED">("MATCHED");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* State View Switcher (for interactive demo / spec completeness) */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Allocation View:</span>
          <span className="text-on-surface-variant">Switch cycle outcome simulation</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAllocationState("MATCHED")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              allocationState === "MATCHED"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Matched (Confirmed)
          </button>
          <button
            onClick={() => setAllocationState("PENDING")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              allocationState === "PENDING"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Cycle In Progress
          </button>
          <button
            onClick={() => setAllocationState("UNMATCHED")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              allocationState === "UNMATCHED"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Stage 2 Recovery
          </button>
        </div>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🎯</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            Engine Determination
          </span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Allocation Status</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Review your finalized system match determination resulting from candidate-proposing Deferred Acceptance.
        </p>
      </div>

      {/* MATCHED STATE */}
      {allocationState === "MATCHED" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Primary Match Card */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-start justify-between border-b border-surface-container pb-4 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    MATCH CONFIRMED
                  </span>
                  <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Synthetic Data (Demo Outcome)
                  </span>
                  <h2 className="text-xl font-bold text-primary">Quantitative Research Analyst</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">Axiom Capital Partners • New Delhi</p>
                </div>
                <span className="text-2xl">✅</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-surface-container-low rounded-lg border border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Priority Tier & Signal
                  </span>
                  <PriorityTierBadge tier={PriorityTier.HIGH} source={SignalSource.ML} />
                </div>

                <div className="p-3 bg-surface-container-low rounded-lg border border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Tenure & Stipend
                  </span>
                  <p className="text-xs font-semibold text-primary">6 Months (Jan - Jun 2027)</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Match Resolution Details:</p>
              <p className="text-[11px] leading-relaxed">
                Candidate Proposal Priority: Rank #1 of student submitted preferences. Employer Signal evaluation: High. Soft Fit score F(c, i): 0.92 (Institution-attested). Synthetic Data: Generated outcome for demonstration purposes only — not a real-world employment prediction.
              </p>
            </div>
          </div>

          {/* Supporting Next Steps Card */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary border-b border-surface-container pb-3 mb-4">
                Next Governance Steps
              </h3>

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-primary block">Review Institutional Packet</span>
                    <span className="text-[11px] text-on-surface-variant">Due in 48 hours</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 opacity-60">
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-primary block">Sign Governance Agreement</span>
                    <span className="text-[11px] text-on-surface-variant">Pending packet review</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 opacity-40">
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-primary block">Placement Cell Confirmation</span>
                    <span className="text-[11px] text-on-surface-variant">Automatic on dual signature</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="w-full py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-xs">
                View Allocation Documentation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PENDING STATE */}
      {allocationState === "PENDING" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-2xl mx-auto">
            ⏳
          </div>
          <h2 className="text-lg font-bold text-primary">Allocation Cycle In Progress</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            The candidate-proposing Gale-Shapley matching run is currently undergoing institutional governance review. Results will be published following final approval.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Governance Status: Under Review
            </span>
          </div>
        </div>
      )}

      {/* UNMATCHED / RECOVERY STATE */}
      {allocationState === "UNMATCHED" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-xl shrink-0">
              🔄
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Stage 2 Process
              </span>
              <h2 className="text-base font-bold text-primary mt-1">Eligible for Stage 2 Recovery Queue</h2>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                You were not allocated in the primary Deferred Acceptance run due to capacity limits. Your profile has been automatically enqueued for locally stable heuristic matching across open capacity slots.
              </p>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-lg border border-slate-200 text-xs space-y-2">
            <p className="font-semibold text-primary">Recovery Allocation Parameters:</p>
            <p className="text-[11px] text-on-surface-variant">
              Stage 2 employs a locally stable heuristic with strict priority preservation. No additional action is required.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/student/preferences"
              className="px-4 py-2 bg-surface-container border border-outline-variant text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Update Preferences for Stage 2
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
