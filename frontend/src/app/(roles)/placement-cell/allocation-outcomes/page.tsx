"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AllocationOutcomeRecord {
  id: string;
  candidateToken: string;
  department: string;
  roleTitle: string;
  companyName: string;
  matchedRank: number;
  priorityScore: number;
  softFitScore: number;
  signalTier: "HIGH" | "MEDIUM" | "LOW";
  status: "CONFIRMED" | "PENDING_DUAL_SIGNATURE" | "STAGE_2_RECOVERY";
}

export default function PlacementCellAllocationOutcomesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const records: AllocationOutcomeRecord[] = [
    {
      id: "out-1",
      candidateToken: "cnd_01_99a81",
      department: "Biotechnology",
      roleTitle: "Bioinformatics Pipeline Engineer",
      companyName: "Axiom Capital Partners",
      matchedRank: 1,
      priorityScore: 0.942,
      softFitScore: 0.96,
      signalTier: "HIGH",
      status: "CONFIRMED",
    },
    {
      id: "out-2",
      candidateToken: "cnd_02_44b20",
      department: "Computer Science",
      roleTitle: "Cloud Architecture Lead",
      companyName: "Stellar Labs",
      matchedRank: 1,
      priorityScore: 0.915,
      softFitScore: 0.92,
      signalTier: "HIGH",
      status: "CONFIRMED",
    },
    {
      id: "out-3",
      candidateToken: "cnd_03_71c55",
      department: "Chemical Engineering",
      roleTitle: "Bioprocess Trainee",
      companyName: "Serum Biologics India",
      matchedRank: 2,
      priorityScore: 0.865,
      softFitScore: 0.88,
      signalTier: "MEDIUM",
      status: "PENDING_DUAL_SIGNATURE",
    },
    {
      id: "out-4",
      candidateToken: "cnd_04_32d99",
      department: "Biotechnology",
      roleTitle: "Laboratory Automation Associate",
      companyName: "Nexus Corp",
      matchedRank: 1,
      priorityScore: 0.792,
      softFitScore: 0.80,
      signalTier: "MEDIUM",
      status: "STAGE_2_RECOVERY",
    },
  ];

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.candidateToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🎯</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Institutional Allocation Outcomes
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Allocation Outcomes</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Finalized candidate-proposing Deferred Acceptance results across institutional cohorts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search token, role, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs w-60"
          />
          <button
            onClick={() => alert("Exporting institutional allocation records...")}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>📥</span> Export Records
          </button>
        </div>
      </div>

      {/* Synthetic Data Notice */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
            Synthetic Data
          </span>
          <span className="text-on-surface-variant text-[11px]">
            Demonstration cohort generated via Part 9 engine — not real employer placement predictions.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        {["ALL", "CONFIRMED", "PENDING_DUAL_SIGNATURE", "STAGE_2_RECOVERY"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === status
                ? "bg-primary-container text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            {status === "ALL"
              ? "All Outcomes"
              : status === "CONFIRMED"
              ? "Confirmed"
              : status === "PENDING_DUAL_SIGNATURE"
              ? "Pending Signature"
              : "Stage 2 Recovery"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="py-3.5 px-6">Candidate Token</th>
                <th className="py-3.5 px-6">Allocated Opportunity</th>
                <th className="py-3.5 px-6">Employer Partner</th>
                <th className="py-3.5 px-6">Proposal Rank</th>
                <th className="py-3.5 px-6">Priority Score</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-mono text-xs text-secondary bg-surface-container px-2 py-1 rounded">
                        {item.candidateToken}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">{item.department}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-primary">{item.roleTitle}</td>
                  <td className="py-4 px-6 text-slate-700">{item.companyName}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Rank #{item.matchedRank}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-bold text-primary">
                    {item.priorityScore.toFixed(3)}
                    <span className="text-[10px] text-slate-500 font-normal block">
                      F(c,i): {item.softFitScore}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : item.status === "PENDING_DUAL_SIGNATURE"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "CONFIRMED"
                            ? "bg-emerald-600"
                            : item.status === "PENDING_DUAL_SIGNATURE"
                            ? "bg-amber-600"
                            : "bg-slate-500"
                        }`}
                      />
                      {item.status === "CONFIRMED"
                        ? "Confirmed"
                        : item.status === "PENDING_DUAL_SIGNATURE"
                        ? "Dual Signature"
                        : "Stage 2 Recovery"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing {filteredRecords.length} of {records.length} allocation records</span>
          <span className="italic text-[11px] text-slate-500">
            Personal identities decoupled via subject mapping.
          </span>
        </div>
      </div>
    </div>
  );
}
