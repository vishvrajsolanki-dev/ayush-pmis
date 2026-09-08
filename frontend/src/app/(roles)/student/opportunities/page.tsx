"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  term: string;
  description: string;
  isEligible: boolean;
  eligibilityRequirements: { name: string; met: boolean }[];
  gradedFitScore: number;
  fitBreakdown: { skill: string; grade: string }[];
  deadlineDays: number;
  featured?: boolean;
}

export default function StudentOpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ELIGIBLE_ONLY">("ALL");

  const opportunities: Opportunity[] = [
    {
      id: "opp-1",
      title: "Quantitative Research Analyst",
      organization: "Axiom Capital Partners",
      location: "New Delhi, NCR",
      term: "6 Months Full-Time",
      description:
        "Join our systematic analytics team to develop computational models for biological sequence datasets. Requires rigorous statistical foundation and Python pipeline knowledge.",
      isEligible: true,
      eligibilityRequirements: [
        { name: "Final Year B.Tech / M.Tech", met: true },
        { name: "Institutional Registration Active", met: true },
      ],
      gradedFitScore: 92,
      fitBreakdown: [
        { skill: "Bioinformatics Pipelines", grade: "A (Verified)" },
        { skill: "Statistical Analysis", grade: "A- (Verified)" },
      ],
      deadlineDays: 12,
      featured: true,
    },
    {
      id: "opp-2",
      title: "Bioprocess Development Trainee",
      organization: "Serum Biologics India",
      location: "Pune, Maharashtra",
      term: "6 Months Full-Time",
      description:
        "Assist senior process scientists with bioreactor optimization and microbial fermentation parameter tuning.",
      isEligible: true,
      eligibilityRequirements: [
        { name: "Biotech / Chemical Background", met: true },
        { name: "Lab Safety Certification", met: true },
      ],
      gradedFitScore: 78,
      fitBreakdown: [
        { skill: "Cell Culture Operations", grade: "B+ (Self-Reported)" },
        { skill: "Fermentation Controls", grade: "B (Self-Reported)" },
      ],
      deadlineDays: 19,
    },
    {
      id: "opp-3",
      title: "Principal Bio-Data Scientist",
      organization: "HealthMatrix Labs",
      location: "Bengaluru, KA",
      term: "Full-Time",
      description:
        "Lead predictive modeling initiatives for clinical trials and patient response trajectories.",
      isEligible: false,
      eligibilityRequirements: [
        { name: "Ph.D. or 3+ YOE in Clinical Genomics", met: false },
        { name: "Primary Investigation Publications", met: false },
      ],
      gradedFitScore: 45,
      fitBreakdown: [{ skill: "Clinical Genomics", grade: "Not Claimed" }],
      deadlineDays: 5,
    },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "ALL" ? true : opp.isEligible;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🔍</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Opportunity Catalog
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Opportunities Board</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Browse available roles. Match rank is determined strictly through Candidate-Proposing Deferred Acceptance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search roles or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3.5 py-2 pl-9 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary w-64 shadow-xs"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          </div>

          <button
            onClick={() => setSelectedFilter(selectedFilter === "ALL" ? "ELIGIBLE_ONLY" : "ALL")}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              selectedFilter === "ELIGIBLE_ONLY"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {selectedFilter === "ELIGIBLE_ONLY" ? "Eligible Roles Only ✓" : "All Roles"}
          </button>
        </div>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {filteredOpportunities.map((opp) => {
          const isFeatured = opp.featured;
          return (
            <article
              key={opp.id}
              className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between overflow-hidden transition-all hover:border-slate-400 ${
                isFeatured ? "md:col-span-12" : "md:col-span-6"
              } ${!opp.isEligible ? "opacity-75 bg-slate-50/50" : ""}`}
            >
              <div
                className={`h-1.5 w-full ${
                  opp.isEligible ? (opp.gradedFitScore >= 80 ? "bg-emerald-500" : "bg-indigo-500") : "bg-rose-400"
                }`}
              />

              <div className={`p-6 ${isFeatured ? "flex flex-col lg:flex-row gap-6" : "space-y-4"}`}>
                {/* Main Role Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {opp.organization}
                      </span>
                      <h2 className="text-lg font-bold text-primary mt-0.5">{opp.title}</h2>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">{opp.description}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-[11px] font-medium bg-surface-container px-2.5 py-1 rounded text-secondary">
                      📍 {opp.location}
                    </span>
                    <span className="text-[11px] font-medium bg-surface-container px-2.5 py-1 rounded text-secondary">
                      ⏱️ {opp.term}
                    </span>
                  </div>
                </div>

                {/* Requirements & Structural Fit Evaluation */}
                <div
                  className={`p-4 bg-surface-container-low rounded-xl border border-slate-200/80 shrink-0 ${
                    isFeatured ? "lg:w-80 space-y-3" : "space-y-3 mt-4"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Requirements Matrix
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">E / F Evaluation</span>
                  </div>

                  {/* Hard Eligibility (Binary) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">Binary Eligibility E(c,i):</span>
                      {opp.isEligible ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-[11px]">
                          <span>✓</span> Met (1)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700 text-[11px]">
                          <span>✕</span> Gap (0)
                        </span>
                      )}
                    </div>
                    <ul className="text-[11px] text-slate-500 space-y-0.5 pl-2 border-l-2 border-slate-200">
                      {opp.eligibilityRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-center justify-between">
                          <span>{req.name}</span>
                          <span>{req.met ? "✓" : "✕"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Graded Soft Fit (Continuous) */}
                  {opp.isEligible && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-primary">Soft Fit Score F(c,i):</span>
                        <span className="font-mono font-bold text-emerald-700">{opp.gradedFitScore}%</span>
                      </div>
                      <ul className="text-[11px] text-slate-500 space-y-0.5 pl-2 border-l-2 border-slate-200">
                        {opp.fitBreakdown.map((f, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span>{f.skill}</span>
                            <span className="font-semibold text-slate-700">{f.grade}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-3 bg-surface-container-low border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">⏳ {opp.deadlineDays} days remaining in cycle</span>

                {opp.isEligible ? (
                  <Link
                    href="/student/preferences"
                    className="px-4 py-1.5 bg-primary-container text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity shadow-xs"
                  >
                    Add to Preferences →
                  </Link>
                ) : (
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold rounded text-[11px]">
                    Requirements Incomplete
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
