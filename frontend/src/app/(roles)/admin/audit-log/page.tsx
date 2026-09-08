"use client";

import React, { useState } from "react";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  object: string;
  tenantContext: string;
  status: "SUCCESS" | "REJECTED_DENIED";
  isSecurityAlert?: boolean;
}

export default function AdminAuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const logs: AuditEntry[] = [
    {
      id: "log-1",
      timestamp: "2026-10-24 14:32:11",
      actor: "sysadmin@anchor.io",
      action: "UPDATE_POLICY",
      object: "org_882",
      tenantContext: "Global",
      status: "SUCCESS",
    },
    {
      id: "log-2",
      timestamp: "2026-10-24 14:28:45",
      actor: "192.168.1.104 (Ext)",
      action: "CROSS_TENANT_ACCESS",
      object: "sys_config_root",
      tenantContext: "Global",
      status: "REJECTED_DENIED",
      isSecurityAlert: true,
    },
    {
      id: "log-3",
      timestamp: "2026-10-24 13:15:02",
      actor: "auditor_k@anchor.io",
      action: "EXPORT_REPORT",
      object: "rpt_q2_alloc",
      tenantContext: "Global",
      status: "SUCCESS",
    },
    {
      id: "log-4",
      timestamp: "2026-10-24 11:42:55",
      actor: "sysadmin@anchor.io",
      action: "CREATE_TENANT",
      object: "org_883_pending",
      tenantContext: "Global",
      status: "SUCCESS",
    },
    {
      id: "log-5",
      timestamp: "2026-10-24 09:05:12",
      actor: "system_auto_sync",
      action: "SYNC_METADATA",
      object: "db_cluster_a",
      tenantContext: "Global",
      status: "SUCCESS",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.object.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📋</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              System Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Audit Log</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Comprehensive append-only audit trail of system actions. Immutable record for compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting audit log CSV...")}
            className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* Table Container (Screen 20: FINAL_Admin_AuditLog) */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search audit trail..."
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
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary font-medium outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              <option value="ALL">All Actions</option>
              <option value="UPDATE_POLICY">UPDATE_POLICY</option>
              <option value="CROSS_TENANT_ACCESS">CROSS_TENANT_ACCESS</option>
              <option value="EXPORT_REPORT">EXPORT_REPORT</option>
              <option value="CREATE_TENANT">CREATE_TENANT</option>
              <option value="SYNC_METADATA">SYNC_METADATA</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3.5 px-6">Timestamp (UTC)</th>
                <th className="py-3.5 px-6">Actor</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Object</th>
                <th className="py-3.5 px-6">Tenant Context</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className={`transition-colors ${
                    log.isSecurityAlert
                      ? "bg-red-50 hover:bg-red-100/80 text-red-900 border-l-4 border-l-red-600"
                      : "hover:bg-slate-50/80 text-primary"
                  }`}
                >
                  <td className="py-3.5 px-6 text-slate-500 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className={`py-3.5 px-6 font-mono text-xs ${log.isSecurityAlert ? "font-bold text-red-700" : ""}`}>
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-6 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        log.isSecurityAlert
                          ? "bg-red-200 text-red-900"
                          : "bg-surface-container text-primary"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                    {log.object}
                  </td>
                  <td className="py-3.5 px-6 font-sans text-slate-600">
                    {log.tenantContext}
                  </td>
                  <td className="py-3.5 px-6 text-right font-sans">
                    {log.status === "SUCCESS" ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-red-700 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        <span>⛔</span> REJECTED_DENIED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing 1-{filteredLogs.length} of {logs.length} audit log events</span>
          <span className="italic text-[11px] text-slate-500">
            Append-only immutability guaranteed upon publication.
          </span>
        </div>
      </div>
    </div>
  );
}
