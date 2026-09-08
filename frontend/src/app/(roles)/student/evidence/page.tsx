"use client";

import React, { useState } from "react";
import { VerificationStatusPill } from "@/components/shared/VerificationStatusPill";
import { EvidenceStatus } from "@/lib/types/enums";

interface Artifact {
  id: string;
  name: string;
  source: string;
  type: "Code Repository" | "Publication" | "Certificate" | "Competition" | "Lab Report";
  date: string;
  size: string;
}

interface SkillClaim {
  id: string;
  title: string;
  description: string;
  status: EvidenceStatus;
  verifierName?: string;
  artifacts: Artifact[];
}

export default function StudentEvidencePage() {
  const [selectedClaimId, setSelectedClaimId] = useState<string>("claim-1");
  const [showCapReachedSimulation, setShowCapReachedSimulation] = useState<boolean>(false);
  const [newClaimModalOpen, setNewClaimModalOpen] = useState(false);

  const initialClaims: SkillClaim[] = [
    {
      id: "claim-1",
      title: "Python Data Analysis & Bioinformatics",
      description: "Genomic variant calling pipelines, Nextflow workflows, and Biopython aligners.",
      status: EvidenceStatus.INSTITUTION_VERIFIED,
      verifierName: "Prof. Rajesh Deshmukh",
      artifacts: [
        {
          id: "art-1",
          name: "Data_Pipeline_Script.py",
          source: "Bioinformatics Lab Project Repository",
          type: "Code Repository",
          date: "Oct 12, 2026",
          size: "12 KB",
        },
        {
          id: "art-2",
          name: "Statistical_Analysis_Report.pdf",
          source: "Department Technical Symposium",
          type: "Publication",
          date: "Nov 05, 2026",
          size: "2.4 MB",
        },
        {
          id: "art-3",
          name: "GitHub: Variant-Calling-Flow",
          source: "External Verified Git Repository",
          type: "Code Repository",
          date: "Jan 18, 2027",
          size: "Link",
        },
      ],
    },
    {
      id: "claim-2",
      title: "Cell Culture & Bioprocess Engineering",
      description: "Lab studies optimizing dissolved oxygen parameters for microbial fermentation.",
      status: EvidenceStatus.SELF_REPORTED,
      artifacts: [
        {
          id: "art-4",
          name: "Fermentation_Kinetic_Data.csv",
          source: "Benchtop Bioreactor Run Logs",
          type: "Lab Report",
          date: "Feb 14, 2027",
          size: "1.1 MB",
        },
      ],
    },
  ];

  const capReachedArtifacts: Artifact[] = [
    {
      id: "art-c1",
      name: "B-Tree Implementation Project",
      source: "CS-401 Final Assignment Repository",
      type: "Code Repository",
      date: "Oct 12, 2026",
      size: "24 KB",
    },
    {
      id: "art-c2",
      name: "Graph Traversal Optimization Paper",
      source: "Published in Student Tech Journal",
      type: "Publication",
      date: "Nov 05, 2026",
      size: "1.8 MB",
    },
    {
      id: "art-c3",
      name: "Advanced Algorithms Certification",
      source: "Coursera - Stanford University",
      type: "Certificate",
      date: "Jan 18, 2027",
      size: "820 KB",
    },
    {
      id: "art-c4",
      name: "Hackathon: Routing Protocol",
      source: "1st Place - Metro Hacks 2026",
      type: "Competition",
      date: "Mar 22, 2027",
      size: "Certificate",
    },
    {
      id: "art-c5",
      name: "Dynamic Programming Solver",
      source: "Open Source Contribution (PR #142)",
      type: "Code Repository",
      date: "May 04, 2027",
      size: "Link",
    },
  ];

  const [claims, setClaims] = useState<SkillClaim[]>(initialClaims);

  const currentClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];
  const currentArtifacts = showCapReachedSimulation ? capReachedArtifacts : currentClaim.artifacts;
  const isCapReached = currentArtifacts.length >= 5;

  const handleDeleteArtifact = (artifactId: string) => {
    if (showCapReachedSimulation) {
      alert("Demonstration mode: artifact deletion simulated.");
      return;
    }
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === currentClaim.id) {
          return {
            ...c,
            artifacts: c.artifacts.filter((a) => a.id !== artifactId),
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* State / View Simulator Switcher Bar */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">State View Mode:</span>
          <span className="text-on-surface-variant">Switch between standard claims view and 5/5 Evidence Cap state</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCapReachedSimulation(false)}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              !showCapReachedSimulation
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Standard View (3/5 Items)
          </button>
          <button
            onClick={() => setShowCapReachedSimulation(true)}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              showCapReachedSimulation
                ? "bg-rose-700 text-white shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Simulate Cap Reached (5/5 Items)
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📄</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Evidence Records
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Evidence Management</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Verified repository of skill claims and evidence artifacts substantiating candidate competencies.
          </p>
        </div>

        <button
          onClick={() => setNewClaimModalOpen(true)}
          className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span>+</span> New Claim
        </button>
      </div>

      {/* Cap Reached Alert Banner (Active when 5/5 items) */}
      {isCapReached && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-sm shrink-0 font-bold">
            ⚠️
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-rose-900">Evidence Cap Reached</h3>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-200/70 text-rose-900">
                5 / 5 Items
              </span>
            </div>
            <p className="text-xs text-rose-700 mt-1">
              A maximum of 5 evidence items is allowed per skill claim. Remove an item to add a new one.
            </p>
          </div>
        </div>
      )}

      {/* Claims Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {claims.map((claim) => {
          const isSelected = claim.id === currentClaim.id && !showCapReachedSimulation;
          return (
            <div
              key={claim.id}
              onClick={() => {
                setShowCapReachedSimulation(false);
                setSelectedClaimId(claim.id);
              }}
              className={`p-5 rounded-xl border transition-all cursor-pointer bg-surface-container-lowest relative ${
                isSelected
                  ? "border-primary ring-1 ring-primary shadow-sm"
                  : "border-outline-variant hover:border-slate-400 shadow-xs"
              }`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
                  claim.status === EvidenceStatus.INSTITUTION_VERIFIED ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <div className="flex items-start justify-between gap-3 pt-1">
                <div>
                  <h3 className="text-sm font-bold text-primary">{claim.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{claim.description}</p>
                </div>
                <VerificationStatusPill status={claim.status} verifierName={claim.verifierName} />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-on-surface-variant">
                <span className="font-mono font-medium">{claim.artifacts.length}/5 Artifacts</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {claim.status === EvidenceStatus.INSTITUTION_VERIFIED ? "Attested" : "Self-Submitted"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Artifacts Table for Active Competency */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Active Skill Claim
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-500">
                {showCapReachedSimulation ? "Advanced Data Structures & Algorithms" : currentClaim.title}
              </span>
            </div>
            <h2 className="text-base font-bold text-primary mt-1">
              Attached Artifacts ({currentArtifacts.length}/5)
            </h2>
          </div>

          <button
            disabled={isCapReached}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              isCapReached
                ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                : "bg-primary-container text-on-primary hover:opacity-90 shadow-sm"
            }`}
            title={isCapReached ? "Maximum 5 evidence items allowed" : "Add evidence artifact"}
          >
            <span>+</span> Add Evidence
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="py-3 px-4">Artifact Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Payload Size</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentArtifacts.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-primary">{art.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{art.source}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-secondary border border-outline-variant">
                      {art.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{art.date}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{art.size}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteArtifact(art.id)}
                      className="text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                      title="Remove Artifact"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {/* Render empty placeholder slots if < 5 */}
              {!isCapReached &&
                Array.from({ length: 5 - currentArtifacts.length }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="bg-slate-50/30 text-slate-400">
                    <td colSpan={5} className="py-2.5 px-4 text-center italic text-[11px]">
                      — Available Evidence Slot ({currentArtifacts.length + idx + 1}/5) —
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal Stub */}
      {newClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-outline-variant shadow-xl">
            <h3 className="text-base font-bold text-primary mb-1">Declare New Skill Claim</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Enter the competency area you wish to substantiate.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Skill / Competency Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Protocols"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Contextual Description</label>
                <textarea
                  rows={3}
                  placeholder="Summarize practical applications and laboratory coursework..."
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setNewClaimModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setNewClaimModalOpen(false)}
                className="px-4 py-1.5 text-xs bg-primary-container text-on-primary font-bold rounded-lg hover:opacity-90"
              >
                Save Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
