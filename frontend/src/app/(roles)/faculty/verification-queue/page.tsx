"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VerificationStatusPill } from "@/components/shared/VerificationStatusPill";
import { EvidenceStatus } from "@/lib/types/enums";

interface QueueItem {
  id: string;
  studentName: string;
  studentId: string;
  skillClaim: string;
  submissionDate: string;
  status: EvidenceStatus;
  isDifferentInstitution?: boolean;
}

export default function FacultyVerificationQueuePage() {
  const [showDeniedScreen, setShowDeniedScreen] = useState(false);

  const queueItems: QueueItem[] = [
    {
      id: "ver-001",
      studentName: "Ananya Sharma",
      studentId: "stud_01_77a94",
      skillClaim: "Bioinformatics & Sequence Analysis",
      submissionDate: "Oct 24, 2026",
      status: EvidenceStatus.SELF_REPORTED,
    },
    {
      id: "ver-002",
      studentName: "Marcus Thorne",
      studentId: "stud_02_38f12",
      skillClaim: "Cloud Architecture Fundamentals",
      submissionDate: "Oct 23, 2026",
      status: EvidenceStatus.SELF_REPORTED,
    },
    {
      id: "ver-003",
      studentName: "Julian Rossi",
      studentId: "stud_03_99c01",
      skillClaim: "Bioprocess Dissolved Oxygen Control",
      submissionDate: "Oct 21, 2026",
      status: EvidenceStatus.SELF_REPORTED,
    },
    {
      id: "ver-004",
      studentName: "Amina El-Sayed",
      studentId: "stud_04_55b88",
      skillClaim: "Agile Project Management",
      submissionDate: "Oct 20, 2026",
      status: EvidenceStatus.SELF_REPORTED,
    },
  ];

  if (showDeniedScreen) {
    return (
      <div className="max-w-xl w-full mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center text-center shadow-sm my-12 space-y-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center text-2xl font-bold">
          🔒
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Access Restricted</h2>
          <p className="text-xs text-on-surface-variant mt-2 max-w-md leading-relaxed">
            You do not have the required permissions to verify this evidence. This student belongs to a different institution.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
          <button
            onClick={() => setShowDeniedScreen(false)}
            className="px-5 py-2 bg-surface-container-lowest border border-outline-variant text-secondary rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => alert("Access request submitted to tenant administrator.")}
            className="px-5 py-2 bg-primary-container text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            Request Cross-Tenant Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* State / View Simulator Switcher */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Verification Flow Simulator:</span>
          <span className="text-on-surface-variant">Test institutional tenant authorization boundaries</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeniedScreen(false)}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              !showDeniedScreen
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Standard Queue
          </button>
          <button
            onClick={() => setShowDeniedScreen(true)}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              showDeniedScreen
                ? "bg-rose-700 text-white shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Simulate Cross-Institution Denied
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">✅</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            Institutional Attestation
          </span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Verification Queue</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Review and verify student competency claims against official department lab records.
        </p>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Skill Claim</th>
                <th className="py-3.5 px-6">Submission Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-primary">{item.studentName}</p>
                      <span className="font-mono text-[10px] text-slate-500 bg-surface-container px-2 py-0.5 rounded">
                        {item.studentId}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-primary">{item.skillClaim}</td>
                  <td className="py-4 px-6 text-slate-500 font-mono">{item.submissionDate}</td>
                  <td className="py-4 px-6">
                    <VerificationStatusPill status={item.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/faculty/verification-detail/${item.id}`}
                      className="px-4 py-1.5 bg-primary-container text-on-primary font-bold rounded-lg text-xs hover:opacity-90 transition-opacity shadow-xs inline-block"
                    >
                      Review & Verify
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Security Footer */}
        <div className="bg-surface-container-low px-6 py-3 border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span className="text-[11px]">
              All faculty attestation decisions are recorded immutably to the institutional audit log.
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Audit Log Active
          </div>
        </div>
      </div>

      {/* Note Callout */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-slate-200 rounded-lg text-xs text-on-surface-variant shadow-xs">
          <span>🏅</span>
          <span>
            Note: Verified claims will display the exact badge &ldquo;<strong>Verified by institution account</strong>&rdquo; across student profiles.
          </span>
        </div>
      </div>
    </div>
  );
}
