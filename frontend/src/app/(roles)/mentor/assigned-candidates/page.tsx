"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AssignedCandidate {
  id: string;
  name: string;
  status: "ALLOCATED" | "UNMATCHED";
  roleTitle?: string;
  verifiedCount: number;
  pendingCount: number;
}

export default function MentorAssignedCandidatesPage() {
  const [viewState, setViewState] = useState<"DEFAULT" | "LOADING" | "EMPTY">("DEFAULT");
  const [searchTerm, setSearchTerm] = useState("");

  const candidates: AssignedCandidate[] = [
    {
      id: "c-1",
      name: "Eleanor Vance",
      status: "ALLOCATED",
      roleTitle: "Data Science Intern",
      verifiedCount: 4,
      pendingCount: 1,
    },
    {
      id: "c-2",
      name: "Marcus Sterling",
      status: "UNMATCHED",
      verifiedCount: 0,
      pendingCount: 3,
    },
    {
      id: "c-3",
      name: "Sophia Chen",
      status: "ALLOCATED",
      roleTitle: "UX Research Associate",
      verifiedCount: 5,
      pendingCount: 0,
    },
    {
      id: "c-4",
      name: "Julian Thorne",
      status: "ALLOCATED",
      roleTitle: "Financial Analyst",
      verifiedCount: 2,
      pendingCount: 2,
    },
    {
      id: "c-5",
      name: "Elias Vane",
      status: "ALLOCATED",
      roleTitle: "Cloud Infrastructure Engineer",
      verifiedCount: 6,
      pendingCount: 0,
    },
  ];

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.roleTitle && c.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Simulation Bar */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Mentor View Simulator:</span>
          <span className="text-on-surface-variant">Switch between standard table, skeleton shimmer loading, and empty cycle states</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewState("DEFAULT")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              viewState === "DEFAULT"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Assigned Roster (Default)
          </button>
          <button
            onClick={() => setViewState("LOADING")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              viewState === "LOADING"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Loading Skeleton Shimmer
          </button>
          <button
            onClick={() => setViewState("EMPTY")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              viewState === "EMPTY"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Empty (Awaiting Cycle)
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">👥</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Mentor Journey
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Assigned Candidates</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage and track candidate allocation and evidence verification progress across assigned cohorts.
          </p>
        </div>

        {viewState === "DEFAULT" && (
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search mentees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs w-56"
            />
          </div>
        )}
      </div>

      {/* DEFAULT STATE (Screen 22) */}
      {viewState === "DEFAULT" && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-surface-container text-[11px] font-bold uppercase tracking-wider text-secondary">
                  <th className="py-3.5 px-6 w-[30%]">Candidate Name</th>
                  <th className="py-3.5 px-6 w-[40%]">Current Allocation Status</th>
                  <th className="py-3.5 px-6 w-[30%]">Evidence Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6 font-semibold text-primary">
                      {candidate.name}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            candidate.status === "ALLOCATED" ? "bg-primary" : "bg-slate-400"
                          }`}
                        />
                        <span className="font-semibold text-primary">
                          {candidate.status === "ALLOCATED" ? "Allocated" : "Unmatched"}
                        </span>
                        {candidate.roleTitle && (
                          <span className="text-secondary">- {candidate.roleTitle}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 bg-surface-container text-primary font-mono rounded text-[11px] font-semibold border border-slate-200">
                          {candidate.verifiedCount} verified
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 bg-surface-container text-secondary font-mono rounded text-[11px] ${candidate.pendingCount === 0 ? "opacity-50" : ""}`}>
                          {candidate.pendingCount} pending
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
            <span>Showing {filteredCandidates.length} of {candidates.length} assigned candidates</span>
            <span className="italic text-[11px] text-slate-500">
              Allocated under candidate-proposing Gale-Shapley matching.
            </span>
          </div>
        </div>
      )}

      {/* LOADING STATE (Screen 23) */}
      {viewState === "LOADING" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-secondary mb-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-outline-variant border-t-primary animate-spin" />
            <span>Loading candidates...</span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-secondary">
              <div className="col-span-4">Candidate Name</div>
              <div className="col-span-4">Current Allocation Status</div>
              <div className="col-span-4">Evidence Progress</div>
            </div>

            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-12 px-6 py-4 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse shrink-0" />
                    <div className="w-3/4 h-4 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div className="col-span-4">
                    <div className="w-1/2 h-5 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <div className="w-20 h-5 rounded bg-slate-200 animate-pulse" />
                    <div className="w-20 h-5 rounded bg-slate-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE (Screen 28) */}
      {viewState === "EMPTY" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[380px] space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl border border-dashed border-slate-300 mb-1">
            👤
          </div>
          <h2 className="text-lg font-bold text-primary">No Active Assignments</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            No candidates are currently assigned to you. When the administrative board executes an allocation cycle with candidate mentor pairing, they will appear here.
          </p>
          <div className="pt-4 border-t border-slate-100 w-full max-w-sm flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Status
            </span>
            <div className="bg-slate-100 px-3.5 py-1 rounded-full flex items-center gap-2 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-xs font-semibold text-slate-600">Awaiting Allocation Cycle</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
