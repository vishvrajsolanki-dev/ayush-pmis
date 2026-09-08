"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(2);
  const [institution, setInstitution] = useState("All India Institute of Technology, Delhi");
  const [enrollment, setEnrollment] = useState<"undergraduate" | "graduate">("undergraduate");
  const [gradMonth, setGradMonth] = useState("06");
  const [gradYear, setGradYear] = useState("2027");
  const [degreeTrack, setDegreeTrack] = useState("B.Tech Biotechnology");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/student/profile");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Container matching Stitch FINAL_Student_Onboarding */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[620px]">
        {/* Left Sidebar - Stepper / Info */}
        <div className="w-full md:w-1/3 bg-surface-container-low p-6 border-b md:border-b-0 md:border-r border-outline-variant flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Anchor Onboarding</span>
              <h1 className="text-xl font-bold text-primary mt-1">Establish Identity</h1>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Complete the following steps to authenticate your academic profile within the Anchor ecosystem.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-6">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-400 text-slate-800 flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wide">Step 1</h3>
                  <p className="text-xs text-on-surface-variant">Role Designation (Student)</p>
                </div>
              </div>

              {/* Step 2 (Active) */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                  2
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wide">Step 2</h3>
                  <p className="text-xs text-primary font-semibold">Institutional Affiliation</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full border border-outline-variant bg-white text-on-surface-variant flex items-center justify-center shrink-0 text-xs font-medium">
                  3
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Step 3</h3>
                  <p className="text-xs text-on-surface-variant">Credential Verification</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant text-center mt-8">
            <div className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
              <span>🛡️</span> Data secured by Anchor Governance Protocol v2.1
            </div>
          </div>
        </div>

        {/* Right Content - Form Canvas */}
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary">Institutional Affiliation</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Verify your academic status to unlock student-specific allocation models.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Academic Institution */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="institution">
                  Academic Institution
                </label>
                <div className="relative">
                  <input
                    id="institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-primary placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                    placeholder="Search by name or AISHE code..."
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Activated
                  </span>
                </div>
              </div>

              {/* Degree Track */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="degreeTrack">
                  Degree / Major Program
                </label>
                <input
                  id="degreeTrack"
                  type="text"
                  value={degreeTrack}
                  onChange={(e) => setDegreeTrack(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                  required
                />
              </div>

              {/* Enrollment Status */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Current Enrollment Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setEnrollment("undergraduate")}
                    className={`flex cursor-pointer rounded-lg border p-3.5 transition-all ${
                      enrollment === "undergraduate"
                        ? "border-primary bg-indigo-50/50 ring-1 ring-primary"
                        : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-primary">Undergraduate</span>
                        <span className={`text-xs ${enrollment === "undergraduate" ? "text-primary" : "text-transparent"}`}>
                          ●
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">Bachelors (B.Tech / B.Sc / B.E.)</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setEnrollment("graduate")}
                    className={`flex cursor-pointer rounded-lg border p-3.5 transition-all ${
                      enrollment === "graduate"
                        ? "border-primary bg-indigo-50/50 ring-1 ring-primary"
                        : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-primary">Graduate</span>
                        <span className={`text-xs ${enrollment === "graduate" ? "text-primary" : "text-transparent"}`}>
                          ●
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">Masters, M.Tech, PhD</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Expected Graduation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="grad_month">
                    Expected Graduation Month
                  </label>
                  <select
                    id="grad_month"
                    value={gradMonth}
                    onChange={(e) => setGradMonth(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                  >
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="grad_year">
                    Expected Graduation Year
                  </label>
                  <input
                    id="grad_year"
                    type="number"
                    min="2024"
                    max="2035"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-surface-container-low border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-on-surface-variant">
                <span className="text-sm">ℹ️</span>
                <p className="text-[11px] leading-relaxed">
                  Your institutional affiliation determines baseline eligibility parameters (E). Skills are validated through attested evidence artifacts.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
                <Link
                  href="/login"
                  className="px-4 py-2 border border-outline-variant bg-surface-container-lowest text-on-surface-variant text-xs font-medium rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  Back
                </Link>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  Continue to Profile <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
