"use client";

import React, { useState } from "react";
import Link from "next/link";

interface OrganizationRecord {
  id: string;
  name: string;
  type: "Institution" | "Company";
  submissionDate: string;
  status: "PENDING" | "ACTIVATED";
  domain: string;
  departmentOrSector: string;
}

export default function AdminOrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([
    {
      id: "org-1",
      name: "Apex Research Institute",
      type: "Institution",
      submissionDate: "2026-10-24 09:15 UTC",
      status: "PENDING",
      domain: "apex.research.edu",
      departmentOrSector: "Biomedical Informatics",
    },
    {
      id: "org-2",
      name: "Nexus Global Logistics",
      type: "Company",
      submissionDate: "2026-10-24 11:30 UTC",
      status: "PENDING",
      domain: "nexusgl.com",
      departmentOrSector: "Supply Chain Solutions",
    },
    {
      id: "org-3",
      name: "University of Applied Sciences",
      type: "Institution",
      submissionDate: "2026-10-23 14:45 UTC",
      status: "PENDING",
      domain: "uas.edu.in",
      departmentOrSector: "Computer Science & Engineering",
    },
    {
      id: "org-4",
      name: "Starlight Manufacturing Ltd.",
      type: "Company",
      submissionDate: "2026-10-23 16:20 UTC",
      status: "PENDING",
      domain: "starlightmfg.io",
      departmentOrSector: "Advanced Materials",
    },
    {
      id: "org-5",
      name: "Acme Academic Systems",
      type: "Institution",
      submissionDate: "2026-10-12 09:15 UTC",
      status: "ACTIVATED",
      domain: "acmeacademic.edu",
      departmentOrSector: "Higher Education / Research",
    },
  ]);

  const handleActivate = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, status: "ACTIVATED" } : org))
    );
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.departmentOrSector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || org.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🏛️</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Institutional Governance
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Activation Queue</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Review and approve pending organization accounts requiring institutional clearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs w-56"
          />
          <button
            onClick={() => alert("Exporting organization registry...")}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>📥</span> Export
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        {["ALL", "Institution", "Company"].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              typeFilter === type
                ? "bg-primary-container text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            {type === "ALL" ? "All Organizations" : `${type}s`}
          </button>
        ))}
      </div>

      {/* Table Container (Screen 15: FINAL_Admin_ActivationQueue) */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3.5 px-6">Organization Name</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Submission Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-sans">
                    <Link
                      href={`/admin/organizations/${org.id}`}
                      className="font-bold text-primary hover:text-indigo-700 hover:underline block"
                    >
                      {org.name}
                    </Link>
                    <span className="font-mono text-[11px] text-slate-500">
                      {org.domain} • {org.departmentOrSector}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-sans text-slate-700">{org.type}</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                    {org.submissionDate}
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        org.status === "ACTIVATED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-surface-container text-slate-700 border border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          org.status === "ACTIVATED" ? "bg-emerald-600" : "bg-slate-400"
                        }`}
                      />
                      {org.status === "ACTIVATED" ? "Activated" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      {org.status === "PENDING" && (
                        <button
                          onClick={(e) => handleActivate(org.id, e)}
                          className="px-3 py-1 bg-emerald-700 text-white font-semibold text-xs rounded hover:bg-emerald-800 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="px-3 py-1 bg-surface-container border border-outline-variant text-xs font-semibold rounded hover:bg-surface-container-high transition-colors"
                      >
                        Review →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span>
            Showing 1-{filteredOrgs.length} of {organizations.length} organizations
          </span>
          <span className="italic text-[11px] text-slate-500">
            Tenant isolation enforced under Subject Identity Mapping.
          </span>
        </div>
      </div>
    </div>
  );
}
