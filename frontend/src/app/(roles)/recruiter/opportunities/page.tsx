"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PostedRole {
  id: string;
  reqId: string;
  title: string;
  department: string;
  candidatesCount: number;
  capacityPercentage: number;
  status: "POSTED" | "DRAFT" | "FILLED" | "CLOSED";
}

export default function RecruiterOpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const roles: PostedRole[] = [
    {
      id: "role-1",
      reqId: "REQ-2026-441",
      title: "Senior Data Engineer",
      department: "Data Platform",
      candidatesCount: 42,
      capacityPercentage: 65,
      status: "POSTED",
    },
    {
      id: "role-2",
      reqId: "REQ-2026-452",
      title: "Product Designer, Core Systems",
      department: "Design",
      candidatesCount: 0,
      capacityPercentage: 0,
      status: "DRAFT",
    },
    {
      id: "role-3",
      reqId: "REQ-2026-418",
      title: "Lead Security Researcher",
      department: "Information Security",
      candidatesCount: 8,
      capacityPercentage: 15,
      status: "POSTED",
    },
    {
      id: "role-4",
      reqId: "REQ-2026-380",
      title: "Frontend Architect",
      department: "Engineering",
      candidatesCount: 24,
      capacityPercentage: 100,
      status: "CLOSED",
    },
  ];

  const filteredRoles = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">💼</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Recruiter Workspace
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Opportunity Management</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage and track the lifecycle of posted roles, hard eligibility rules, and candidate pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting recruiter opportunities...")}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors shadow-xs"
          >
            Export Report
          </button>
          <Link
            href="/recruiter/opportunities/create"
            className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            <span>+</span> New Opportunity
          </Link>
        </div>
      </div>

      {/* Bento Grid Metrics (Atmospheric context from Screen 13) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Active Pipeline
            </span>
            <span className="text-base">📈</span>
          </div>
          <div className="text-3xl font-bold text-primary font-mono mb-1">1,248</div>
          <div className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
              +12%
            </span>{" "}
            vs last month
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Time to Fill (Avg)
            </span>
            <span className="text-base">⏱️</span>
          </div>
          <div className="text-3xl font-bold text-primary font-mono mb-1">34 Days</div>
          <div className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
              -2 Days
            </span>{" "}
            improvement
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Placement Rate
            </span>
            <span className="text-base">🎯</span>
          </div>
          <div className="text-3xl font-bold text-primary font-mono mb-1">87%</div>
          <div className="text-xs text-on-surface-variant">Top quartile performance</div>
        </div>
      </section>

      {/* Opportunities Table */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        {/* Table Header/Controls */}
        <div className="p-4 border-b border-surface-container bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-sm font-bold text-primary">Posted Roles ({filteredRoles.length})</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs w-48"
            />
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-surface-container text-[11px] font-bold uppercase tracking-wider text-secondary">
                <th className="py-3.5 px-6">Role Title & REQ ID</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Candidate Pipeline</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{role.title}</span>
                      <span className="text-secondary font-mono text-[10px] mt-0.5">{role.reqId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{role.department}</td>
                  <td className="py-4 px-6">
                    {role.status === "DRAFT" ? (
                      <span className="text-slate-400 italic text-[11px]">—</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="bg-surface-container w-16 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary-container h-full rounded-full"
                            style={{ width: `${role.capacityPercentage}%` }}
                          />
                        </div>
                        <span className="text-secondary text-[11px] font-mono">
                          {role.candidatesCount} Active
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        role.status === "POSTED"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : role.status === "DRAFT"
                          ? "bg-slate-100 text-slate-700 border border-slate-300"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          role.status === "POSTED"
                            ? "bg-indigo-600"
                            : role.status === "DRAFT"
                            ? "bg-slate-400"
                            : "bg-emerald-600"
                        }`}
                      />
                      {role.status === "POSTED"
                        ? "Posted"
                        : role.status === "DRAFT"
                        ? "Draft"
                        : "Closed / Filled"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href="/recruiter/shared-evidence"
                      className="px-3 py-1 bg-surface-container border border-outline-variant text-xs font-semibold rounded hover:bg-surface-container-high transition-colors"
                    >
                      View Candidates →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low flex justify-between items-center text-xs text-secondary">
          <span>Showing 1 to {filteredRoles.length} of {roles.length} Opportunities</span>
          <span className="italic text-[11px] text-slate-500">
            Hard eligibility constraints enforced via binary filter E(c,i) in Gale-Shapley matching.
          </span>
        </div>
      </section>
    </div>
  );
}
