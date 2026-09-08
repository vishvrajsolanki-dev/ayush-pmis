"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SampleGatedView } from "@/components/shared/SampleGatedView";

export default function PlacementCellAnalyticsPage() {
  const [selectedView, setSelectedView] = useState<"OVERVIEW" | "PUBLIC_POLICY_DRILLDOWN">("OVERVIEW");
  const [sampleCount, setSampleCount] = useState<number>(6); // Default < 10 for demonstration of privacy suppression

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Interactive View Switcher Banner */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Analytics View:</span>
          <span className="text-on-surface-variant">Switch between overall placement performance and sector-specific privacy suppression</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedView("OVERVIEW")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              selectedView === "OVERVIEW"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Placement Overview
          </button>
          <button
            onClick={() => setSelectedView("PUBLIC_POLICY_DRILLDOWN")}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              selectedView === "PUBLIC_POLICY_DRILLDOWN"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Public Policy (N &lt; 10 Suppressed)
          </button>
        </div>
      </div>

      {/* OVERVIEW VIEW (Screen 9: FINAL_PlacementCell_Analytics) */}
      {selectedView === "OVERVIEW" && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">📊</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Institutional Intelligence
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Synthetic Data
                </span>
              </div>
              <h1 className="text-2xl font-bold text-primary">Placement Analytics Overview</h1>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Aggregate placement outcomes governed by k-anonymity privacy thresholds (N ≥ 10 suppression).
              </p>
            </div>
            <button
              onClick={() => alert("Exporting institutional placement analytics report...")}
              className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto"
            >
              Export Report
            </button>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Overall Match Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary font-mono">87.4%</span>
                <span className="text-xs text-emerald-700 font-semibold">vs 82.1% last year</span>
              </div>
              <div className="w-full bg-surface-container h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "87.4%" }} />
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Total Placements
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary font-mono">1,245</span>
                <span className="text-xs text-on-surface-variant">Candidates</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">Across 42 institutional partner firms</p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Avg. Time to Offer
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary font-mono">42</span>
                <span className="text-xs text-on-surface-variant">Days</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">Cycle completion to bilateral signing</p>
            </div>
          </div>

          {/* Sector Performance Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-primary border-b border-outline-variant pb-2">
              Sector-Wise Performance
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Technology & Engineering */}
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-primary">Technology & Engineering</h4>
                  <span className="bg-surface-container-low border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-semibold text-secondary">
                    Tier 1 Focus
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-secondary">Match Rate</span>
                    <span className="font-mono font-bold text-primary">92%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-secondary">Placement Cycle</span>
                    <span className="font-mono font-bold text-primary">2026-27</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-secondary">Top Recruiter</span>
                    <span className="font-semibold text-primary">Tech Corp Inc.</span>
                  </div>
                </div>
              </div>

              {/* Operations & Consulting */}
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-primary">Operations & Consulting</h4>
                  <span className="bg-surface-container-low border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-semibold text-secondary">
                    High Demand
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-secondary">Match Rate</span>
                    <span className="font-mono font-bold text-primary">88%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-secondary">Placement Cycle</span>
                    <span className="font-mono font-bold text-primary">2026-27</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-secondary">Top Recruiter</span>
                    <span className="font-semibold text-primary">Global Services LC</span>
                  </div>
                </div>
              </div>

              {/* Locked Card: Public Policy / Gov */}
              <div
                onClick={() => setSelectedView("PUBLIC_POLICY_DRILLDOWN")}
                className="bg-surface-container-lowest border-2 border-dashed border-outline-variant p-6 rounded-xl flex flex-col items-center justify-center text-center min-h-[190px] relative overflow-hidden cursor-pointer hover:border-primary transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg text-slate-500 mb-2 group-hover:scale-105 transition-transform">
                  🔒
                </div>
                <h4 className="text-sm font-bold text-primary">Public Policy / Gov</h4>
                <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
                  Insufficient Sample Size for Aggregate Analytics (N &lt; 10)
                </p>
                <span className="mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  Data Withheld — Click to View Policy Notice
                </span>
              </div>

              {/* Healthcare Management */}
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-primary">Healthcare Management</h4>
                  <span className="bg-surface-container-low border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-semibold text-secondary">
                    Emerging
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-secondary">Match Rate</span>
                    <span className="font-mono font-bold text-primary">76%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-secondary">Placement Cycle</span>
                    <span className="font-mono font-bold text-primary">2026-27</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-secondary">Top Recruiter</span>
                    <span className="font-semibold text-primary">Serum Biologics India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUBLIC POLICY DRILLDOWN (Screen 26: FINAL_Institution_Analytics_InsufficientSample) */}
      {selectedView === "PUBLIC_POLICY_DRILLDOWN" && (
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <button
              onClick={() => setSelectedView("OVERVIEW")}
              className="hover:text-primary transition-colors font-medium"
            >
              Analytics
            </button>
            <span>›</span>
            <span>Allocation Outcomes</span>
            <span>›</span>
            <span className="text-primary font-bold">Public Policy / Gov</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-primary">Sector Performance: Public Policy / Gov</h1>
            <p className="text-xs text-on-surface-variant mt-0.5 max-w-3xl">
              Review allocation outcomes, historical trends, and demographic breakdowns for the selected sector. Data integrity and privacy policies apply strictly to small sample sizes.
            </p>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sector Context Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 pb-2 border-b border-surface-container">
                  Sector Context
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Public Policy / Gov results are locked until the sector meets the minimum privacy threshold.
                </p>
              </div>

              <button
                onClick={() => alert("Summary report generated for approved governance officers.")}
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface-variant text-xs font-semibold py-2 px-4 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
              >
                <span>📥</span> Export Summary Report
              </button>
            </div>

            {/* Suppressed Demographic Card */}
            <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-primary">Demographic Outcome Distribution</h3>
                <span className="text-[11px] font-mono text-slate-500 bg-surface-container px-2 py-0.5 rounded">
                  Below privacy threshold
                </span>
              </div>

              {/* Striped Privacy Wrapper with SampleGatedView */}
              <SampleGatedView sampleSize={sampleCount} minThreshold={10}>
                {/* Fallback if sample count is >= 10 */}
                <div className="p-6 bg-surface-container-low rounded-lg border border-slate-200 text-xs">
                  <p className="font-bold text-primary mb-2">Detailed Demographic Breakdown (N ≥ 10 Authorized):</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Urban Cohort: 45% (Placement Index: 0.88)</li>
                    <li>• Rural & Semi-Urban: 55% (Placement Index: 0.91)</li>
                  </ul>
                </div>
              </SampleGatedView>

              {/* Sample Size Simulation Controls */}
              <div className="p-3 bg-surface-container-low rounded-lg border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Test Privacy Threshold Simulation:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSampleCount(6)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      sampleCount < 10
                        ? "bg-rose-700 text-white"
                        : "bg-surface-container text-slate-700"
                    }`}
                  >
                    Below threshold (Suppressed)
                  </button>
                  <button
                    onClick={() => setSampleCount(14)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      sampleCount >= 10
                        ? "bg-emerald-700 text-white"
                        : "bg-surface-container text-slate-700"
                    }`}
                  >
                    N = 14 (Allowed)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suppressed metrics */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs text-center">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
                Sector metrics
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-on-surface-variant">Suppressed until the privacy threshold is met.</span>
              </div>
            </div>

            <div className="hidden">
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
                Target Alignment Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-primary">B+</span>
                <span className="text-xs text-on-surface-variant font-medium">Stable</span>
              </div>
            </div>

            <div className="hidden">
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
                Data Quality Index
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-primary">—</span>
                <span className="text-xs text-emerald-700 font-semibold">✓ Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
