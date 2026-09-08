"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { VerificationStatusPill } from "@/components/shared/VerificationStatusPill";
import { EvidenceStatus } from "@/lib/types/enums";

export default function FacultyVerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "ev-1";

  // Simulator toggle between Screen 5 (Success/Active) and Screen 6 (Denied/Cross-Institution)
  const [isAccessDenied, setIsAccessDenied] = useState(id === "denied" || id === "cross-inst");
  const [currentStatus, setCurrentStatus] = useState<EvidenceStatus>(
    isAccessDenied ? EvidenceStatus.SELF_REPORTED : EvidenceStatus.INSTITUTION_VERIFIED
  );
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleVerify = () => {
    setCurrentStatus(EvidenceStatus.INSTITUTION_VERIFIED);
    setActionNotice("Claim successfully verified. Badge updated to 'Verified by institution account'.");
  };

  const handleReject = () => {
    setCurrentStatus(EvidenceStatus.SELF_REPORTED);
    setActionNotice("Attestation declined. Record maintained as self-reported.");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 relative">
      {/* Simulation Controller */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Faculty Verification State Simulator:</span>
          <span className="text-on-surface-variant">Switch between authorized claim view (Screen 5) and cross-institution denied view (Screen 6)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAccessDenied(false);
              setCurrentStatus(EvidenceStatus.INSTITUTION_VERIFIED);
            }}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              !isAccessDenied
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Authorized Claim (Screen 5)
          </button>
          <button
            onClick={() => {
              setIsAccessDenied(true);
            }}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              isAccessDenied
                ? "bg-primary-container text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            Cross-Institution Denied (Screen 6)
          </button>
        </div>
      </div>

      {/* Screen 6: Denied Overlay */}
      {isAccessDenied && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 max-w-md w-full text-center shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4 text-2xl">
              🔒
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Access Restricted</h2>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              You do not have the required permissions to verify this evidence. This student belongs to a different institution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={() => router.push("/faculty/verification-queue")}
                className="px-5 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-secondary text-xs font-semibold hover:bg-surface-container-low transition-colors"
              >
                ← Go Back
              </button>
              <button
                onClick={() => alert("Cross-institution access request logged.")}
                className="px-5 py-2 rounded-lg bg-primary-container text-on-primary text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div>
        <Link
          href="/faculty/verification-queue"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <span>←</span> Back to Queue
        </Link>
      </div>

      {/* Page Header (Screen 5) */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-bold text-primary">Python Data Analysis</h1>
            <VerificationStatusPill status={currentStatus} verifierName="Prof. Rajesh Deshmukh" />
          </div>
          <p className="text-xs text-on-surface-variant">
            Submitted by Jane Doe (ID: 987654321 • B.Tech Computer Science)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReject}
            className="px-4 py-2 border border-outline-variant bg-surface-container-lowest text-on-surface-variant text-xs font-semibold rounded-lg hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors shadow-xs"
          >
            Reject
          </button>
          <button
            onClick={handleVerify}
            className="px-5 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            <span>✓</span> Verify Claim
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-indigo-600 hover:text-indigo-900 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Col: Details */}
        <div className="md:col-span-8 space-y-6">
          {/* Claim Description */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-primary mb-3">Claim Description</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Applied advanced Python libraries (Pandas, NumPy, Scikit-learn) to analyze a dataset of over 50,000 records. Cleaned data, performed exploratory data analysis (EDA), and developed a predictive model to forecast trends with 85% accuracy. The project culminated in a detailed Jupyter Notebook outlining the methodology and findings.
            </p>
          </section>

          {/* Attached Artifacts */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-primary">Attached Artifacts (2 Items)</h3>
              <span className="text-[11px] text-slate-500">Student Proof Documents</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-surface-container-low hover:border-primary transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    📄
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-primary">Final_Project_Report.pdf</p>
                    <p className="text-[11px] text-slate-500">2.4 MB • Oct 14, 2026</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-700 opacity-80 group-hover:opacity-100">
                  Open PDF ↗
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-surface-container-low hover:border-primary transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    🔗
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-primary">GitHub: Predictive-Model-Repo</p>
                    <p className="text-[11px] text-slate-500">github.com/janedoe/predictive-model</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-700 opacity-80 group-hover:opacity-100">
                  Open Link ↗
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Col: Claim Metadata */}
        <div className="md:col-span-4">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 pb-2 border-b border-surface-container">
              Claim Metadata
            </h3>

            <ul className="space-y-3 text-xs">
              <li>
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide block mb-1">
                  Category
                </span>
                <div className="bg-surface-container-low px-3 py-2 rounded-lg font-medium text-primary border border-slate-200/60">
                  Technical Skill / Coursework
                </div>
              </li>

              <li>
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide block mb-1">
                  Proficiency Level
                </span>
                <div className="bg-surface-container-low px-3 py-2 rounded-lg font-medium text-primary border border-slate-200/60">
                  Advanced
                </div>
              </li>

              <li>
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide block mb-1">
                  Verification Status
                </span>
                <div className="mt-1">
                  <VerificationStatusPill status={currentStatus} verifierName="Prof. Rajesh Deshmukh" />
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
