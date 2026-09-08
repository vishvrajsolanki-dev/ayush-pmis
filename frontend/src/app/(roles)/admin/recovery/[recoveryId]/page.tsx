"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AffectedCandidate {
  id: string;
  candidateId: string;
  candidateName: string;
  originalAllocation: string;
  priorityScore: number;
  recoveryStatus: "Re-matching" | "Maintained" | "Unmatched";
}

export default function AdminRecoveryDetailPage() {
  const params = useParams();
  const recoveryId = (params?.recoveryId as string) || "evt-8924-r";
  const [progress, setProgress] = useState(75);
  const [isResolving, setIsResolving] = useState(true);

  const [affectedCandidates, setAffectedCandidates] = useState<AffectedCandidate[]>([
    {
      id: "ac-1",
      candidateId: "CND-9021-A",
      candidateName: "Eleanor Vance",
      originalAllocation: "Data Science Fellowship",
      priorityScore: 0.942,
      recoveryStatus: "Re-matching",
    },
    {
      id: "ac-2",
      candidateId: "CND-9022-B",
      candidateName: "Marcus Sterling",
      originalAllocation: "Supply Chain Analytics Associate",
      priorityScore: 0.885,
      recoveryStatus: "Maintained",
    },
    {
      id: "ac-3",
      candidateId: "CND-9023-C",
      candidateName: "Sophia Chen",
      originalAllocation: "UX Research Lead Associate",
      priorityScore: 0.794,
      recoveryStatus: "Re-matching",
    },
    {
      id: "ac-4",
      candidateId: "CND-9024-D",
      candidateName: "Julian Thorne",
      originalAllocation: "Quantitative Risk Analyst",
      priorityScore: 0.685,
      recoveryStatus: "Unmatched",
    },
  ]);

  const handleEscalateRerun = () => {
    alert("Escalating event EVT-8924-R to administrative board for full market rerun authorization.");
  };

  const handleManualRematch = (id: string) => {
    setAffectedCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, recoveryStatus: "Maintained" } : c))
    );
    setProgress(100);
    setIsResolving(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
        <Link
          href="/admin/recovery"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <span>←</span>
          <span>Recovery Queue</span>
        </Link>
        <span>›</span>
        <span className="text-primary font-bold">Event {recoveryId.toUpperCase()}</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🔄</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Recovery Event Details
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              Synthetic Data
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Perturbation Resolution: {recoveryId.toUpperCase()}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Targeted re-matching execution trace isolating candidate seat changes to affected subsystem.
          </p>
        </div>

        <button
          onClick={handleEscalateRerun}
          className="px-4 py-2 bg-red-700 text-white text-xs font-bold rounded-lg hover:bg-red-800 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span>⚠️</span> Escalate to Full Market Rerun
        </button>
      </div>

      {/* Disclaimer Banner (Screen 17) */}
      <div className="bg-surface-container-low border-l-4 border-indigo-700 p-4 rounded-xl flex items-start gap-3 shadow-xs">
        <span className="text-xl text-indigo-700 mt-0.5">ℹ️</span>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">
            locally stable heuristic
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            This recovery event is utilizing a localized stabilization algorithm to prevent cascading reassignments. Changes are isolated to the affected subset to preserve overarching market stability.
          </p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lineage Trace (4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>🌳</span> Lineage Trace
          </h3>
          <div className="relative pl-5 border-l-2 border-slate-200 space-y-5">
            <div className="relative">
              <div className="absolute -left-[27px] top-1 bg-white border-2 border-indigo-600 w-3.5 h-3.5 rounded-full" />
              <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Parent Run ID
              </div>
              <div className="font-mono text-xs font-bold text-primary mt-0.5">RUN-2026-Q1-A</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Completed: 2026-10-15 08:00 UTC</div>
            </div>

            <div className="relative">
              <div className="absolute -left-[27px] top-1 bg-red-600 border-2 border-red-600 w-3.5 h-3.5 rounded-full" />
              <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Exception Trigger
              </div>
              <div className="font-mono text-xs font-bold text-red-600 mt-0.5">
                Capacity Violation (Inst-402)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Detected: 2026-10-15 08:45 UTC</div>
            </div>

            <div className="relative">
              <div className="absolute -left-[27px] top-1 bg-indigo-100 border-2 border-indigo-600 w-3.5 h-3.5 rounded-full" />
              <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Current Event
              </div>
              <div className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded inline-block mt-0.5">
                {recoveryId.toUpperCase()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Active Status: {isResolving ? "Resolving..." : "Complete"}
              </div>
            </div>
          </div>
        </div>

        {/* Process Metrics (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span>📊</span> Process Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Affected Candidates
                </div>
                <div className="text-2xl font-bold font-mono text-primary">24</div>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Involved Institutions
                </div>
                <div className="text-2xl font-bold font-mono text-primary">3</div>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Stabilized Count
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700">22 / 24</div>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-lg border-l-4 border-indigo-700 border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Algorithm
                </div>
                <div className="text-xs font-bold text-primary mt-1">Deferred Acceptance</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-on-surface-variant">Resolution Progress</span>
              <span className="text-xs font-mono font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Affected Set Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <span>👥</span> Affected Candidate Set ({affectedCandidates.length})
          </h3>
          <button
            onClick={() => alert("Exporting affected set...")}
            className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-semibold text-secondary hover:bg-surface-container transition-colors shadow-xs"
          >
            Export Set
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3.5 px-6">Candidate ID & Name</th>
                <th className="py-3.5 px-6">Original Allocation</th>
                <th className="py-3.5 px-6">Priority Score</th>
                <th className="py-3.5 px-6">Recovery Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {affectedCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-sans">
                    <span className="font-bold text-primary block">{c.candidateName}</span>
                    <span className="font-mono text-[11px] text-slate-500">{c.candidateId}</span>
                  </td>
                  <td className="py-4 px-6 font-sans text-primary font-medium">
                    {c.originalAllocation}
                  </td>
                  <td className="py-4 px-6 font-bold text-primary font-mono">
                    {c.priorityScore.toFixed(3)}
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.recoveryStatus === "Maintained"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : c.recoveryStatus === "Re-matching"
                          ? "bg-sky-50 text-sky-800 border border-sky-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.recoveryStatus === "Maintained"
                            ? "bg-emerald-600"
                            : c.recoveryStatus === "Re-matching"
                            ? "bg-sky-600"
                            : "bg-red-600"
                        }`}
                      />
                      {c.recoveryStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    {c.recoveryStatus !== "Maintained" ? (
                      <button
                        onClick={() => handleManualRematch(c.id)}
                        className="px-3 py-1 bg-surface-container border border-outline-variant text-xs font-semibold rounded hover:bg-surface-container-high transition-colors"
                      >
                        Resolve Match →
                      </button>
                    ) : (
                      <span className="text-emerald-700 text-xs font-semibold">✓ Stabilized</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
