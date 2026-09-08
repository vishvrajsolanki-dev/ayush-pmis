"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PreferenceItem {
  id: string;
  title: string;
  company: string;
  location: string;
}

export default function StudentPreferencesPage() {
  const [availablePool, setAvailablePool] = useState<PreferenceItem[]>([
    {
      id: "pool-1",
      title: "Bioinformatics Pipeline Engineer",
      company: "Axiom Capital Partners",
      location: "New Delhi",
    },
    {
      id: "pool-2",
      title: "Bioprocess Development Trainee",
      company: "Serum Biologics India",
      location: "Pune",
    },
    {
      id: "pool-3",
      title: "Machine Learning Research Fellow",
      company: "Stellar Labs",
      location: "Bengaluru",
    },
    {
      id: "pool-4",
      title: "Systems Architecture Lead",
      company: "Nexus Corp",
      location: "Hyderabad",
    },
  ]);

  const [rankedList, setRankedList] = useState<PreferenceItem[]>([
    {
      id: "rank-1",
      title: "Quantitative Research Analyst",
      company: "Axiom Capital Partners",
      location: "New Delhi",
    },
    {
      id: "rank-2",
      title: "Frontend Engineering - Genomic Visualization",
      company: "Creative Dynamics",
      location: "Bengaluru",
    },
  ]);

  const [submitted, setSubmitted] = useState(false);

  const addToRanked = (item: PreferenceItem) => {
    setAvailablePool((prev) => prev.filter((i) => i.id !== item.id));
    setRankedList((prev) => [...prev, item]);
    setSubmitted(false);
  };

  const removeFromRanked = (item: PreferenceItem) => {
    setRankedList((prev) => prev.filter((i) => i.id !== item.id));
    setAvailablePool((prev) => [...prev, item]);
    setSubmitted(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...rankedList];
    const temp = newList[index - 1];
    newList[index - 1] = newList[index];
    newList[index] = temp;
    setRankedList(newList);
    setSubmitted(false);
  };

  const moveDown = (index: number) => {
    if (index === rankedList.length - 1) return;
    const newList = [...rankedList];
    const temp = newList[index + 1];
    newList[index + 1] = newList[index];
    newList[index] = temp;
    setRankedList(newList);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">⭐</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Matching Preferences
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Submit Preferences</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Rank your requested opportunities for the upcoming candidate-proposing Deferred Acceptance cycle.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm self-start md:self-auto"
        >
          {submitted ? "Preferences Submitted ✓" : "Submit Final List →"}
        </button>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <span>
            <strong>Success:</strong> Your preference list has been recorded and saved. You may modify your order until the cycle cutoff.
          </span>
          <Link href="/student/allocation-status" className="font-bold underline ml-4">
            View Cycle Status →
          </Link>
        </div>
      )}

      {/* Information Banner (Incomplete Validation Spec compliance) */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex items-start gap-3 shadow-xs">
        <span className="text-base text-primary">ℹ️</span>
        <div>
          <h3 className="text-xs font-bold text-primary">Partial Submissions Allowed</h3>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            There is no minimum quota or required list length. You may submit an incomplete or empty preference list. The Gale-Shapley candidate-proposing engine will honor whatever preferences are provided.
          </p>
        </div>
      </div>

      {/* Bento Grid: Available Pool vs Ranked List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Available Pool */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-surface-container-low px-2.5 py-1 rounded border border-slate-200">
              Available Pool
            </span>
            <span className="font-mono text-xs text-slate-500 bg-surface-container px-2 py-0.5 rounded">
              {availablePool.length} Roles
            </span>
          </div>

          <div className="space-y-2.5">
            {availablePool.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                All available roles added to your ranked list.
              </div>
            ) : (
              availablePool.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs hover:border-primary transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-primary">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.company} • {item.location}</p>
                  </div>
                  <button
                    onClick={() => addToRanked(item)}
                    className="p-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors shrink-0"
                    title="Add to Ranked List"
                  >
                    + Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Ranked Preferences */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-surface-container-low px-2.5 py-1 rounded border border-slate-200">
              Your Ranked Order (1 = Highest Preference)
            </span>
            <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {rankedList.length} Selected
            </span>
          </div>

          <div className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl p-4 space-y-2.5 min-h-[360px]">
            {rankedList.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
                <span className="text-2xl mb-1">📋</span>
                <p className="text-xs font-semibold">Your ranked list is currently empty.</p>
                <p className="text-[11px] mt-0.5">Click &ldquo;+ Add&rdquo; on any available role to set priority.</p>
              </div>
            ) : (
              rankedList.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs flex items-center justify-between gap-3 relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l" />
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-7 h-7 rounded-lg bg-surface-container font-bold text-xs text-primary flex items-center justify-center font-mono">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.company} • {item.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={`p-1.5 rounded text-xs font-bold transition-colors ${
                        index === 0
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                      }`}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === rankedList.length - 1}
                      className={`p-1.5 rounded text-xs font-bold transition-colors ${
                        index === rankedList.length - 1
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                      }`}
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => removeFromRanked(item)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded text-xs transition-colors ml-1"
                      title="Remove from List"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
