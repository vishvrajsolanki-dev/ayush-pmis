"use client";

import React, { useState } from "react";
import Link from "next/link";

interface RecoveryOperation {
  id: string;
  triggerEvent: string;
  refCode: string;
  affectedCount: string;
  parentRun: string;
  status: "QUEUED" | "RUNNING" | "RESOLVED" | "ESCALATED";
  timestamp: string;
}

export default function AdminRecoveryQueuePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const operations: RecoveryOperation[] = [
    {
      id: "evt-8924-r",
      triggerEvent: "Candidate Dropout",
      refCode: "Ref: DO-992-A",
      affectedCount: "14 Candidates",
      parentRun: "RUN-2026-Q4-MAIN",
      status: "QUEUED",
      timestamp: "2026-10-24 14:15 UTC",
    },
    {
      id: "evt-8925-c",
      triggerEvent: "Constraint Violation",
      refCode: "Ref: CV-104-B",
      affectedCount: "2 Institutions",
      parentRun: "RUN-2026-Q4-MAIN",
      status: "RUNNING",
      timestamp: "2026-10-24 13:40 UTC",
    },
    {
      id: "evt-8920-a",
      triggerEvent: "Capacity Adjustment",
      refCode: "Ref: CA-882-C",
      affectedCount: "42 Candidates",
      parentRun: "RUN-2026-Q3-SUPP",
      status: "RESOLVED",
      timestamp: "2026-10-22 09:20 UTC",
    },
    {
      id: "evt-8918-x",
      triggerEvent: "Unsatisfiable Constraints",
      refCode: "Ref: UC-001-X",
      affectedCount: "8 Candidates",
      parentRun: "RUN-2026-Q4-MAIN",
      status: "ESCALATED",
      timestamp: "2026-10-20 16:50 UTC",
    },
  ];

  const filteredOps = operations.filter((op) => {
    const matchesSearch =
      op.triggerEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.refCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.parentRun.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || op.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Warning Banner (DESIGN.md Rule 13) */}
      <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-4 flex items-start gap-3 shadow-xs">
        <span className="text-xl mt-0.5">⚠️</span>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">
            System Notice: locally stable heuristic
          </h4>
          <p className="text-xs leading-relaxed text-amber-800">
            System operating under locally stable heuristic. Recovery operations isolate perturbations to affected candidate-opportunity subsets and do not carry full market stability guarantees.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🔄</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Perturbation Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Recovery Queue</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage and monitor allocation recovery operations requiring administrative intervention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting recovery queue report...")}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>📥</span> Export
          </button>
        </div>
      </div>

      {/* Table Container (Screen 18: FINAL_Admin_RecoveryQueue) */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary font-medium outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="QUEUED">Queued</option>
              <option value="RUNNING">Running</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3.5 px-6">Triggering Event</th>
                <th className="py-3.5 px-6">Affected Count</th>
                <th className="py-3.5 px-6">Cycle (Parent Run)</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredOps.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-sans">
                    <Link
                      href={`/admin/recovery/${op.id}`}
                      className="font-bold text-primary hover:text-indigo-700 hover:underline block"
                    >
                      {op.triggerEvent}
                    </Link>
                    <span className="font-mono text-[11px] text-slate-500">{op.refCode}</span>
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <span className="bg-surface-container px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                      {op.affectedCount}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">
                    {op.parentRun}
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        op.status === "QUEUED"
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : op.status === "RUNNING"
                          ? "bg-surface-container text-primary border border-slate-300"
                          : op.status === "RESOLVED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          op.status === "QUEUED"
                            ? "bg-sky-600"
                            : op.status === "RUNNING"
                            ? "bg-indigo-600 animate-pulse"
                            : op.status === "RESOLVED"
                            ? "bg-emerald-600"
                            : "bg-red-600"
                        }`}
                      />
                      {op.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    <Link
                      href={`/admin/recovery/${op.id}`}
                      className="px-3 py-1 bg-surface-container border border-outline-variant text-xs font-semibold rounded hover:bg-surface-container-high transition-colors"
                    >
                      Inspect Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing 1-{filteredOps.length} of {operations.length} recovery events</span>
          <span className="italic text-[11px] text-slate-500">
            Localized reassignments execute without full market disruption.
          </span>
        </div>
      </div>
    </div>
  );
}
