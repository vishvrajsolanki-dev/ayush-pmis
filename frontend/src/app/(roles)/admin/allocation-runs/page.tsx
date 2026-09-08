"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GovernanceStatusBadge } from "@/components/shared/GovernanceStatusBadge";
import { AllocationRunStatus } from "@/lib/types/enums";

interface RunRow {
  id: string;
  runCode: string;
  cycleName: string;
  dateCreated: string;
  status: AllocationRunStatus;
  totalMatched: number;
}

export default function AdminAllocationRunsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const runs: RunRow[] = [
    {
      id: "run-1",
      runCode: "RUN-2026-11-001",
      cycleName: "Fall 2026 Cohort Primary Matching",
      dateCreated: "Nov 12, 2026 14:30 UTC",
      status: AllocationRunStatus.DRAFT,
      totalMatched: 0,
    },
    {
      id: "run-2",
      runCode: "RUN-2026-11-002",
      cycleName: "Fall 2026 Cohort Primary Matching",
      dateCreated: "Nov 13, 2026 09:15 UTC",
      status: AllocationRunStatus.PROPOSED,
      totalMatched: 1420,
    },
    {
      id: "run-3",
      runCode: "RUN-2026-11-003",
      cycleName: "Fall 2026 Biomedical Specialized Cohort",
      dateCreated: "Nov 14, 2026 11:45 UTC",
      status: AllocationRunStatus.UNDER_REVIEW,
      totalMatched: 850,
    },
    {
      id: "run-4",
      runCode: "RUN-2026-10-028",
      cycleName: "Mid-Term Supplementary Allocation",
      dateCreated: "Oct 28, 2026 16:20 UTC",
      status: AllocationRunStatus.APPROVED,
      totalMatched: 312,
    },
    {
      id: "run-5",
      runCode: "RUN-2026-10-015",
      cycleName: "Early Decision Matching Pool",
      dateCreated: "Oct 15, 2026 08:00 UTC",
      status: AllocationRunStatus.PUBLISHED,
      totalMatched: 1195,
    },
    {
      id: "run-6",
      runCode: "RUN-2026-09-042",
      cycleName: "Summer Extended Practicum Run",
      dateCreated: "Sep 22, 2026 10:30 UTC",
      status: AllocationRunStatus.OVERRIDDEN,
      totalMatched: 440,
    },
    {
      id: "run-7",
      runCode: "RUN-2026-09-011",
      cycleName: "Pre-Cycle Benchmark Test Run",
      dateCreated: "Sep 05, 2026 13:45 UTC",
      status: AllocationRunStatus.INVALIDATED,
      totalMatched: 0,
    },
  ];

  const filteredRuns = runs.filter((r) => {
    const matchesSearch =
      r.runCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cycleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">⚙️</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Governance Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Allocation Runs</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Comprehensive history of all system allocation cycles, deferred acceptance matching runs, and audit snapshots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/allocation-runs/run-2"
            className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            <span>+</span> New Run
          </Link>
        </div>
      </div>

      {/* Table Container (Screen 16: FINAL_Admin_AllocationRunsList) */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by Run ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary font-medium outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              <option value="ALL">All Statuses (7 States)</option>
              {Object.values(AllocationRunStatus).map((st) => (
                <option key={st} value={st}>
                  {st.replace("_", " ")}
                </option>
              ))}
            </select>
            <button
              onClick={() => alert("Exporting allocation runs CSV report...")}
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
                <th className="py-3.5 px-6 w-1/4">Run ID & Cycle</th>
                <th className="py-3.5 px-6 w-1/4">Date Created</th>
                <th className="py-3.5 px-6 w-1/4">Status</th>
                <th className="py-3.5 px-6 w-1/4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-sans">
                    <Link
                      href={`/admin/allocation-runs/${run.id}`}
                      className="font-bold text-primary hover:text-indigo-700 hover:underline block font-mono text-xs"
                    >
                      {run.runCode}
                    </Link>
                    <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                      {run.cycleName}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                    {run.dateCreated}
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <GovernanceStatusBadge status={run.status} />
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    <Link
                      href={`/admin/allocation-runs/${run.id}`}
                      className="px-3 py-1 bg-surface-container border border-outline-variant text-xs font-semibold rounded hover:bg-surface-container-high transition-colors"
                    >
                      {run.status === AllocationRunStatus.OVERRIDDEN ||
                      run.status === AllocationRunStatus.INVALIDATED
                        ? "Audit Trail →"
                        : run.status === AllocationRunStatus.PUBLISHED ||
                          run.status === AllocationRunStatus.APPROVED
                        ? "View Details →"
                        : "Review →"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination / Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing 1-{filteredRuns.length} of {runs.length} records</span>
          <span className="italic text-[11px] text-slate-500">
            Allocation snapshots are immutable upon publication.
          </span>
        </div>
      </div>
    </div>
  );
}
