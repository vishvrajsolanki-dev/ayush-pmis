"use client";

import React, { useState } from "react";
import { VerificationStatusPill } from "@/components/shared/VerificationStatusPill";
import { EvidenceStatus } from "@/lib/types/enums";
import Link from "next/link";

export default function StudentProfilePage() {
  const [visibility, setVisibility] = useState<"DISCOVERABLE" | "PRIVATE" | "APP_SHARED">("PRIVATE");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ananya.sharma@ayush.edu.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header section matching Stitch FINAL_Student_Profile */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Candidate Profile
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Ananya Sharma</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="font-mono text-xs text-secondary bg-surface-container px-2.5 py-1 rounded">
              ID: stud_01_77a94
            </span>
            <span className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
              <span>📍</span> New Delhi, NCR Campus
            </span>
          </div>
        </div>

        {/* Profile Visibility Toggle */}
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-2 flex items-center gap-2 self-start md:self-auto shadow-sm">
          <span className="text-xs font-semibold text-on-surface-variant px-1">Profile Visibility:</span>
          <div className="flex bg-surface-container border border-outline-variant rounded p-0.5 text-xs">
            <button
              onClick={() => setVisibility("DISCOVERABLE")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                visibility === "DISCOVERABLE"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Discoverable
            </button>
            <button
              onClick={() => setVisibility("PRIVATE")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                visibility === "PRIVATE"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Private
            </button>
            <button
              onClick={() => setVisibility("APP_SHARED")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                visibility === "APP_SHARED"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              App-Shared
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Academic Context (Primary Focus) */}
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="text-base">🎓</span>
                <h2 className="text-base font-bold text-primary">Academic Context</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Eligibility Core</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-surface-container-low rounded-lg border border-slate-200/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Primary Program of Study
                </p>
                <p className="text-sm font-semibold text-primary">B.Tech Biotechnology (4th Year)</p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-slate-200/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Expected Completion
                </p>
                <p className="text-sm font-semibold text-primary">June 2027</p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-slate-200/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Institution & Department
                </p>
                <p className="text-sm font-semibold text-primary">All India Institute of Technology, Delhi</p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-slate-200/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Registration Status
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Active Registration
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Availability: <strong>6 Months Full-Time (Jan - Jun 2027)</strong></span>
            <Link href="/student/preferences" className="text-indigo-700 hover:underline font-bold">
              Review Allocation Preferences →
            </Link>
          </div>
        </div>

        {/* Identity Records */}
        <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-surface-container">
              <span className="text-base">🪪</span>
              <h2 className="text-base font-bold text-primary">Identity Records</h2>
            </div>

            <ul className="space-y-4 text-xs">
              <li>
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Institutional Email
                </p>
                <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg border border-slate-200">
                  <span className="font-mono text-primary truncate">ananya.sharma@ayush.edu.in</span>
                  <button
                    onClick={handleCopyEmail}
                    className="ml-2 text-secondary hover:text-primary transition-colors text-[11px] font-semibold"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </li>

              <li>
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  System Registration Date
                </p>
                <p className="text-sm font-semibold text-primary">August 14, 2026</p>
              </li>

              <li>
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Primary Faculty Advisor
                </p>
                <p className="text-sm font-semibold text-primary">Prof. Rajesh Deshmukh</p>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 italic block">
              Identity decoupled from match engine tokens.
            </span>
          </div>
        </div>
      </div>

      {/* Claimed Competencies & Evidence Summary */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
          <div>
            <h2 className="text-base font-bold text-primary">Skill Claims & Attestation Status</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Institution-verified claims provide official attestation for opportunity matching.
            </p>
          </div>
          <Link
            href="/student/evidence"
            className="px-3.5 py-1.5 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Manage Evidence →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-outline-variant bg-surface-container-lowest space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-primary">Bioinformatics & Sequence Analysis</h3>
              <VerificationStatusPill status={EvidenceStatus.INSTITUTION_VERIFIED} verifierName="Prof. Rajesh Deshmukh" />
            </div>
            <p className="text-xs text-on-surface-variant">
              Genomic variant calling pipelines, Nextflow workflows, and Biopython aligners.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
              <span>2 Artifacts Attached</span>
              <span className="font-semibold text-emerald-700">Attested</span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-outline-variant bg-surface-container-lowest space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-primary">Cell Culture & Bioprocess</h3>
              <VerificationStatusPill status={EvidenceStatus.INSTITUTION_VERIFIED} verifierName="Prof. Rajesh Deshmukh" />
            </div>
            <p className="text-xs text-on-surface-variant">
              Lab studies optimizing dissolved oxygen parameters for microbial fermentation.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
              <span>1 Artifact Attached</span>
              <span className="font-semibold text-emerald-700">Attested</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
