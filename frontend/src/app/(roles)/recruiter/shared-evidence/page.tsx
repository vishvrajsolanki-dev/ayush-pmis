"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VerificationStatusPill } from "@/components/shared/VerificationStatusPill";
import { EvidenceStatus } from "@/lib/types/enums";

export default function RecruiterSharedEvidencePage() {
  const [activeTab, setActiveTab] = useState<"ALEX_CHEN" | "ALL_RECORDS">("ALEX_CHEN");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Interactive Switcher */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Candidate Evidence Vault:</span>
          <span className="text-on-surface-variant">Review shared academic proofs & artifacts</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("ALEX_CHEN")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              activeTab === "ALEX_CHEN"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Alex Chen (Detailed Portfolio Review)
          </button>
          <button
            onClick={() => setActiveTab("ALL_RECORDS")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              activeTab === "ALL_RECORDS"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            All Shared Candidate Records
          </button>
        </div>
      </div>

      {activeTab === "ALEX_CHEN" ? (
        <div className="space-y-6">
          {/* Breadcrumb / Navigation */}
          <div className="flex items-center gap-2 text-xs text-secondary">
            <Link href="/recruiter/opportunities" className="hover:text-primary transition-colors">
              ← Back to Opportunities
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-primary">Alex Chen - Portfolio Review</h1>
                <VerificationStatusPill status={EvidenceStatus.INSTITUTION_VERIFIED} />
              </div>
              <p className="text-xs text-secondary font-mono">
                Shared Evidence Record ID: EV-2026-8942 • Candidate Token: cnd_08_88a12
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Candidate evaluation record exported.")}
                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors shadow-xs"
              >
                Export Evaluation
              </button>
            </div>
          </div>

          {/* Bento Grid Layout (Screen 11) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (Identity & Skills) */}
            <div className="md:col-span-4 space-y-5">
              {/* Candidate Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xl mb-3">
                  AC
                </div>
                <h3 className="text-base font-bold text-primary">Alex Chen</h3>
                <p className="text-xs text-secondary mt-0.5">Computer Science & Design</p>
                <div className="mt-4 bg-surface-container-low border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
                  Expected Graduation: 2027
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  Academic records are strictly excluded under the privacy charter.
                </p>
              </div>

              {/* Verified Competencies */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  Verified Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["UI/UX Design", "React.js", "Figma", "User Research", "Prototyping", "Nextflow", "TypeScript"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="bg-surface-container-low border border-slate-200/80 px-2.5 py-1 rounded-md text-xs font-medium text-primary font-mono"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Evidence Artifacts) */}
            <div className="md:col-span-8 space-y-5">
              {/* Evidence Item 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-primary">
                      Capstone Project: Accessible Nav Systems
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">University Sponsored Research</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>✓</span> Completed
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Led a team of three in developing a new navigation system for visually impaired users. Conducted over 40 user interviews and created high-fidelity prototypes that were tested in real-world scenarios.
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                    Attached Artifacts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface-container-low hover:border-primary transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">📄</span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-primary truncate">Research_Methodology.pdf</p>
                          <p className="text-[10px] text-slate-500">2.4 MB • Oct 2026</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-700 group-hover:underline">↗</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface-container-low hover:border-primary transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🔗</span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-primary truncate">Figma_Prototype_v3</p>
                          <p className="text-[10px] text-slate-500">External Design System Link</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-700 group-hover:underline">↗</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Item 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-primary">
                      Design Systems Independent Study
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">Faculty Directed Seminar</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>✓</span> Completed
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Audited and refactored a mock enterprise design system. Established design tokens, component anatomy guidelines, and accessibility standards for a library of 50+ components.
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                    Attached Artifacts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface-container-low hover:border-primary transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">💻</span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-primary truncate">Token_Architecture.json</p>
                          <p className="text-[10px] text-slate-500">15 KB • Formatted Schema</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-700 group-hover:underline">↗</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ALL RECORDS LIST VIEW */
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-sm font-bold text-primary">Shared Candidate Evidence Records</h3>
            <span className="text-xs font-mono text-slate-500">3 Total Records Shared</span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="text-xs font-bold text-primary">Alex Chen (cnd_08_88a12)</h4>
                <p className="text-[11px] text-slate-500">2 Evidence Items • UI/UX Design, React.js</p>
              </div>
              <button
                onClick={() => setActiveTab("ALEX_CHEN")}
                className="px-3 py-1.5 bg-primary-container text-on-primary text-xs font-bold rounded-lg"
              >
                Inspect Portfolio →
              </button>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="text-xs font-bold text-primary">Ananya Sharma (cnd_01_77a94)</h4>
                <p className="text-[11px] text-slate-500">2 Evidence Items • Bioinformatics, Nextflow</p>
              </div>
              <button
                onClick={() => setActiveTab("ALEX_CHEN")}
                className="px-3 py-1.5 bg-surface-container border border-outline-variant text-xs font-semibold rounded-lg hover:bg-surface-container-high"
              >
                Inspect Portfolio →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
