import React from "react";
import { AuditLogItem } from "@/lib/types/models";

interface AuditTableProps {
  logs: AuditLogItem[];
}

export function AuditTable({ logs }: AuditTableProps) {
  return (
    <div className="overflow-x-auto border border-outline-variant rounded-xl bg-surface-container-lowest">
      <table className="w-full text-left text-xs">
        <thead className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant uppercase font-semibold">
          <tr>
            <th className="py-3 px-4">Timestamp</th>
            <th className="py-3 px-4">Actor</th>
            <th className="py-3 px-4">Action</th>
            <th className="py-3 px-4">Object</th>
            <th className="py-3 px-4">Details</th>
            <th className="py-3 px-4">Security Flag</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-highest">
          {logs.map((log) => (
            <tr
              key={log.id}
              className={log.isCrossTenantAttempt ? "bg-rose-50/70" : "hover:bg-surface-container-low/50"}
            >
              <td className="py-3 px-4 font-mono text-on-surface-variant">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="py-3 px-4 font-medium text-on-surface">
                {log.actor} <span className="text-[10px] text-on-surface-variant">({log.actorRole})</span>
              </td>
              <td className="py-3 px-4 font-mono font-semibold text-primary">
                {log.action}
              </td>
              <td className="py-3 px-4 text-on-surface-variant">
                {log.objectType} / {log.objectId}
              </td>
              <td className="py-3 px-4 text-on-surface max-w-xs truncate" title={log.details}>
                {log.details}
              </td>
              <td className="py-3 px-4">
                {log.isCrossTenantAttempt ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    ⚠️ Cross-Tenant Attempt
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700">Valid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
