"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminOrganizationDetailPage() {
  const params = useParams();
  const orgId = (params?.id as string) || "org-5";

  const [status, setStatus] = useState<"ACTIVATED" | "PENDING">("ACTIVATED");
  const [isEditing, setIsEditing] = useState(false);
  const [orgName, setOrgName] = useState("Acme Academic Systems");
  const [contact, setContact] = useState("Dr. Jane Smith (jsmith@acmeacademic.edu)");
  const [sector, setSector] = useState("Higher Education / Research");
  const [regDate, setRegDate] = useState("October 12, 2026");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
        <Link
          href="/admin/organizations"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <span>←</span>
          <span>Institutions/Companies</span>
        </Link>
        <span>›</span>
        <span className="text-primary font-bold">Organization Detail</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">{orgName}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Organization Record Identifier: <span className="font-mono text-primary font-semibold">{orgId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              status === "ACTIVATED"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-surface-container text-slate-700 border border-slate-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === "ACTIVATED" ? "bg-emerald-600" : "bg-slate-400"
              }`}
            />
            {status === "ACTIVATED" ? "Activated" : "Pending Clearance"}
          </span>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 bg-surface-container-lowest border border-outline-variant text-primary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>✏️</span> {isEditing ? "Done Editing" : "Edit Record"}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout (Screen 14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Profile & Location */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-primary mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span>🏛️</span> Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Organization Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant rounded-md text-primary"
                  />
                ) : (
                  <div className="text-xs font-medium text-primary bg-surface-container-low border border-outline-variant rounded-lg p-3">
                    {orgName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Primary Contact
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant rounded-md text-primary"
                  />
                ) : (
                  <div className="text-xs font-medium text-primary bg-surface-container-low border border-outline-variant rounded-lg p-3">
                    {contact}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Sector / Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant rounded-md text-primary"
                  />
                ) : (
                  <div className="text-xs font-medium text-primary bg-surface-container-low border border-outline-variant rounded-lg p-3">
                    {sector}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Registration Date
                </label>
                <div className="text-xs font-medium text-primary bg-surface-container-low border border-outline-variant rounded-lg p-3">
                  {regDate}
                </div>
              </div>
            </div>
          </section>

          {/* Location Data */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-primary mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span>📍</span> Location Data & Geographic Verification
            </h2>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-28 h-28 bg-slate-200 border border-outline-variant rounded-lg flex flex-col items-center justify-center text-center p-2 shrink-0">
                <span className="text-2xl mb-1">🗺️</span>
                <span className="text-[10px] font-mono font-bold text-slate-600">GeoMap Visualizer</span>
                <span className="text-[9px] text-slate-500">42.3601° N, 71.0589° W</span>
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Headquarters
                </label>
                <address className="text-xs text-primary not-italic leading-relaxed">
                  100 University Ave<br />
                  Building 4, Suite 200<br />
                  Boston, MA 02110<br />
                  United States
                </address>
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  Domain DNS records validated against autonomous institutional root registrars.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): System Status & Verification History */}
        <div className="lg:col-span-4 space-y-6">
          {/* System Status */}
          <section className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
            <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <span>⚙️</span> System Status
            </h2>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center mb-4">
              <span className="text-2xl block mb-1">
                {status === "ACTIVATED" ? "✅" : "⏳"}
              </span>
              <div className="text-sm font-bold text-primary">
                {status === "ACTIVATED" ? "Activated" : "Pending Approval"}
              </div>
              <div className="text-xs text-on-surface-variant mt-0.5">
                {status === "ACTIVATED"
                  ? "Ready for Allocation Runs"
                  : "Requires clearance to enter matching pool"}
              </div>
              {status === "PENDING" && (
                <button
                  onClick={() => setStatus("ACTIVATED")}
                  className="mt-3 w-full py-1.5 bg-emerald-700 text-white font-semibold text-xs rounded hover:bg-emerald-800 transition-colors"
                >
                  Clear & Activate
                </button>
              )}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-on-surface-variant font-medium">Platform ID</span>
                <span className="font-mono text-primary font-bold bg-surface-container px-2 py-0.5 rounded">
                  ORG-884-X2A
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant font-medium">Created By</span>
                <span className="text-primary font-semibold">System Admin</span>
              </div>
            </div>
          </section>

          {/* Verification History */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <span>🛡️</span> Verification History
            </h2>
            <div className="relative pl-4 border-l-2 border-slate-200 space-y-4 mt-4">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Oct 14, 2026 • 14:30 UTC
                </div>
                <div className="text-xs font-bold text-primary mt-0.5">
                  Identity Verification Completed
                </div>
                <div className="text-[11px] text-slate-500">Provider: GlobalData Inc.</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Oct 12, 2026 • 09:15 UTC
                </div>
                <div className="text-xs font-bold text-primary mt-0.5">
                  Profile Created
                </div>
                <div className="text-[11px] text-slate-500">Initial Data Ingestion</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Oct 10, 2026 • 11:00 UTC
                </div>
                <div className="text-xs font-bold text-primary mt-0.5">
                  Application Received
                </div>
                <div className="text-[11px] text-slate-500">Pending Review</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
