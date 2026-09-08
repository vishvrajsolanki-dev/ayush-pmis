"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AllocationRunStatus } from "@/lib/types/enums";
import { GovernanceStatusBadge } from "@/components/shared/GovernanceStatusBadge";

interface ReviewPairing {
  id: string;
  candidateName: string;
  candidateToken: string;
  assignedOpportunity: string;
  priorityScore: number;
  priorityTier: "High" | "Medium" | "Low";
  signalSource: "Model" | "Fallback";
  status: "Matched" | "Pending" | "Overridden";
  overrideReason?: string;
}

export default function AdminAllocationRunReviewPage() {
  const params = useParams();
  const runId = (params?.runId as string) || "run-2";

  // Simulator toggle for Screen 19 (Normal / Under Review) vs Screen 27 (Invalidated)
  const [isInvalidated, setIsInvalidated] = useState(runId === "run-7");
  const [runStatus, setRunStatus] = useState<AllocationRunStatus>(
    isInvalidated ? AllocationRunStatus.INVALIDATED : AllocationRunStatus.UNDER_REVIEW
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPairing, setSelectedPairing] = useState<ReviewPairing | null>(null);
  const [overrideAssignment, setOverrideAssignment] = useState("");
  const [overrideReason, setOverrideReason] = useState("");

  const [pairings, setPairings] = useState<ReviewPairing[]>([
    {
      id: "p-1",
      candidateName: "Dr. Elena Rostova",
      candidateToken: "cnd_01_88a12",
      assignedOpportunity: "Quantum Dynamics Lab Lead",
      priorityScore: 0.942,
      priorityTier: "High",
      signalSource: "Model",
      status: "Matched",
    },
    {
      id: "p-2",
      candidateName: "Eleanor Vance",
      candidateToken: "cnd_02_44b20",
      assignedOpportunity: "Data Science Fellowship",
      priorityScore: 0.895,
      priorityTier: "High",
      signalSource: "Model",
      status: "Matched",
    },
    {
      id: "p-3",
      candidateName: "Marcus Sterling",
      candidateToken: "cnd_03_71c55",
      assignedOpportunity: "Supply Chain Analytics Associate",
      priorityScore: 0.812,
      priorityTier: "Medium",
      signalSource: "Fallback",
      status: "Matched",
    },
    {
      id: "p-4",
      candidateName: "Sophia Chen",
      candidateToken: "cnd_04_32d99",
      assignedOpportunity: "UX Research Lead Associate",
      priorityScore: 0.774,
      priorityTier: "Medium",
      signalSource: "Model",
      status: "Matched",
    },
    {
      id: "p-5",
      candidateName: "Julian Thorne",
      candidateToken: "cnd_05_90e11",
      assignedOpportunity: "Quantitative Risk Analyst",
      priorityScore: 0.685,
      priorityTier: "Low",
      signalSource: "Fallback",
      status: "Matched",
    },
  ]);

  const handleOpenOverride = (p: ReviewPairing) => {
    setSelectedPairing(p);
    setOverrideAssignment("");
    setOverrideReason("");
  };

  const handleConfirmOverride = () => {
    if (!selectedPairing || !overrideAssignment || !overrideReason.trim()) {
      alert("Please provide both a new assignment and a mandatory justification reason.");
      return;
    }

    setPairings((prev) =>
      prev.map((item) =>
        item.id === selectedPairing.id
          ? {
              ...item,
              assignedOpportunity:
                overrideAssignment === "3"
                  ? "Unassigned (Pool Return)"
                  : overrideAssignment === "1"
                  ? "Research Assistant - AI Ethics"
                  : "Data Engineering Intern",
              status: "Overridden",
              overrideReason: overrideReason,
            }
          : item
      )
    );

    setRunStatus(AllocationRunStatus.OVERRIDDEN);
    setSelectedPairing(null);
  };

  const handleCommitAllocation = () => {
    setRunStatus(AllocationRunStatus.APPROVED);
    alert("Allocation run approved. Immutable snapshot queued for publication.");
  };

  const filteredPairings = pairings.filter(
    (p) =>
      p.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.assignedOpportunity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.candidateToken.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Simulation Bar */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Governance State Simulator:</span>
          <span className="text-on-surface-variant">Switch between standard review and invalidated run states</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsInvalidated(false);
              setRunStatus(AllocationRunStatus.UNDER_REVIEW);
            }}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              !isInvalidated
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Active Run Review (Screen 19)
          </button>
          <button
            onClick={() => {
              setIsInvalidated(true);
              setRunStatus(AllocationRunStatus.INVALIDATED);
            }}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              isInvalidated
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Invalidated Run (Screen 27)
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
        <Link
          href="/admin/allocation-runs"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <span>←</span>
          <span>Allocation Runs</span>
        </Link>
        <span>›</span>
        <span className="text-primary font-bold">Run Review ({runId})</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-primary">Allocation Run Review</h1>
            <GovernanceStatusBadge status={runStatus} />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              Synthetic Data
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            {isInvalidated
              ? "This run was marked stale due to upstream preference revocation or capacity adjustment."
              : "Reviewing candidate-to-opportunity pairings generated under Deferred Acceptance matching."}
          </p>
        </div>

        {/* Policy Alpha Box (per-run recorded parameter) or Action */}
        {!isInvalidated ? (
          <div className="bg-surface-container-low border border-outline-variant px-5 py-3 rounded-xl flex items-center gap-3">
            <span className="text-2xl">📐</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Policy Alpha (policy_alpha)
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl font-mono font-bold text-primary">0.60</p>
                <span className="text-[10px] text-slate-500 font-sans">(per-run recorded value)</span>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/admin/allocation-runs/run-1"
            className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            <span>▶</span> Start New Run
          </Link>
        )}
      </div>

      {/* Screen 27: Warning Banner if Invalidated */}
      {isInvalidated && (
        <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-xl flex items-start gap-3 shadow-xs">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <h3 className="text-sm font-bold text-red-900 mb-0.5">Run Invalidated</h3>
            <p className="text-xs text-red-700 leading-relaxed">
              This allocation run is stale due to a subsequent system change (e.g. capacity retraction or revoked evidence). A new run is required to ensure market stability.
            </p>
          </div>
        </div>
      )}

      {/* Data Table Card (Screen 19 & Screen 27) */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search candidates or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isInvalidated && (
              <span className="bg-surface-container text-slate-600 font-mono text-[11px] font-bold px-2.5 py-1 rounded">
                Read Only
              </span>
            )}
            <button
              onClick={() => alert("Exporting review report...")}
              className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-semibold text-secondary hover:bg-surface-container transition-colors shadow-xs"
            >
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3.5 px-6">Candidate Name</th>
                <th className="py-3.5 px-6">Assigned Opportunity</th>
                <th className="py-3.5 px-6">Priority Score</th>
                <th className="py-3.5 px-6">Signal Source</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredPairings.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-sans">
                    <span className="font-bold text-primary block">{p.candidateName}</span>
                    <span className="font-mono text-[11px] text-slate-500">{p.candidateToken}</span>
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <span className="font-semibold text-primary">{p.assignedOpportunity}</span>
                    {p.overrideReason && (
                      <span className="block text-[10px] text-purple-700 italic font-sans mt-0.5">
                        Justification: {p.overrideReason}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          p.priorityTier === "High"
                            ? "bg-emerald-600"
                            : p.priorityTier === "Medium"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <span className="font-mono font-bold text-primary">
                        {p.priorityScore.toFixed(3)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <span className="bg-surface-container px-2 py-0.5 rounded text-[11px] text-slate-700 font-medium">
                      {p.signalSource}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === "Matched"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : p.status === "Overridden"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-600 border border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.status === "Matched"
                            ? "bg-indigo-600"
                            : p.status === "Overridden"
                            ? "bg-purple-600"
                            : "bg-slate-400"
                        }`}
                      />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    {!isInvalidated && (
                      <button
                        onClick={() => handleOpenOverride(p)}
                        className="px-3 py-1 bg-surface-container border border-outline-variant text-xs font-semibold rounded hover:bg-surface-container-high transition-colors text-primary"
                      >
                        Override
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span>
            Showing 1-{filteredPairings.length} of {pairings.length} candidate pairings
          </span>
          <span className="italic text-[11px] text-slate-500">
            Priority = α·F(c,i) + (1−α)·O(c,i) enforced uniformly across all proposals.
          </span>
        </div>
      </div>

      {/* Governance Actions Bar (if not invalidated) */}
      {!isInvalidated && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex justify-between items-center shadow-xs">
          <button
            onClick={() => alert("Run review cancelled.")}
            className="px-4 py-2 border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Cancel Run
          </button>
          <button
            onClick={handleCommitAllocation}
            className="px-5 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            Commit Allocation & Snapshot
          </button>
        </div>
      )}

      {/* Screen 21: FINAL_Admin_OverrideModal */}
      {selectedPairing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-xl border border-outline-variant flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-primary">Manual Allocation Override</h3>
              <button
                onClick={() => setSelectedPairing(null)}
                className="text-slate-400 hover:text-primary transition-colors text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Target Info (System Read-Only) */}
              <div className="bg-surface-container-low p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                  <span className="text-on-surface-variant font-medium">Target Candidate:</span>
                  <span className="font-semibold text-primary">{selectedPairing.candidateName}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-on-surface-variant font-medium">Original Match:</span>
                  <span className="font-semibold text-primary">{selectedPairing.assignedOpportunity}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-primary mb-1">
                    New Assignment <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={overrideAssignment}
                    onChange={(e) => setOverrideAssignment(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-primary outline-none focus:ring-2 focus:ring-primary shadow-xs"
                  >
                    <option value="">Select new assignment...</option>
                    <option value="1">Research Assistant - AI Ethics</option>
                    <option value="2">Data Engineering Intern</option>
                    <option value="3">Unassigned (Return to Pool)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">
                    Override Justification Reason <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Provide mandatory governance justification for breaking algorithmic stability..."
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-primary outline-none focus:ring-2 focus:ring-primary shadow-xs resize-none"
                  />
                </div>
              </div>

              {/* Rule Notice */}
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
                <span className="text-sm mt-0.5">ℹ️</span>
                <p className="leading-relaxed">
                  Manual overrides are recorded immanently and do not inherit original Deferred-Acceptance stability labels.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-outline-variant bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPairing(null)}
                className="px-4 py-2 border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
