"use client";

import React from "react";
import Link from "next/link";
import { UserRole } from "@/lib/types/enums";
import { useAuth } from "@/lib/auth/AuthContext";

const PERSONA_CARDS = [
  {
    role: UserRole.STUDENT,
    title: "Student Persona",
    badge: "Self-Service",
    description: "Manage skill claims with evidence cap enforcement (max 5), configure profile privacy, submit ranked preferences, and view DA allocation status.",
    href: "/student/profile",
    icon: "👤",
    screens: ["Profile & Visibility", "Skill Evidence", "Opportunities", "Ranked Preferences", "Allocation Status"],
  },
  {
    role: UserRole.FACULTY,
    title: "Faculty Persona",
    badge: "Institution Scope",
    description: "Review institutional student roster, process verification queue for skill evidence, and attest to student claims with institution-verified status.",
    href: "/faculty/verification-queue",
    icon: "✅",
    screens: ["Student Roster", "Verification Queue", "Verify Evidence Modal", "Cross-Institution Guard"],
  },
  {
    role: UserRole.PLACEMENT_CELL,
    title: "Placement Cell (TPO)",
    badge: "Institution Scope",
    description: "Inspect cohort-level allocation outcomes and privacy-gated institutional analytics (strict N >= 10 minimum sample size suppression).",
    href: "/placement-cell/analytics",
    icon: "📊",
    screens: ["Institutional Analytics (N>=10 Gated)", "Allocation Outcomes"],
  },
  {
    role: UserRole.RECRUITER,
    title: "Recruiter Persona",
    badge: "Company Scope",
    description: "Create and publish internship opportunities with hard eligibility (E) and soft fit (F) criteria, and inspect application-scoped shared evidence.",
    href: "/recruiter/opportunities",
    icon: "💼",
    screens: ["Opportunity Management", "Create Opportunity (E/F)", "Shared Evidence"],
  },
  {
    role: UserRole.MENTOR,
    title: "Mentor Persona",
    badge: "Assigned Scope",
    description: "View candidates assigned for specialized academic advising and technical interview preparation with empty and loading states.",
    href: "/mentor/assigned-candidates",
    icon: "🤝",
    screens: ["Assigned Candidates (Default / Empty / Loading)"],
  },
  {
    role: UserRole.ADMIN,
    title: "Platform Administrator",
    badge: "Governance Scope",
    description: "Activate pending institutions & companies, review proposed DA allocation runs, execute accountable overrides with mandatory reasons, and inspect cross-tenant audit logs.",
    href: "/admin/organizations",
    icon: "⚙️",
    screens: ["Institutions / Companies (Activation Queue)", "Allocation Runs (Review & Override)", "Recovery Queue", "Audit Log"],
  },
];

export default function HomePage() {
  const { switchRole } = useAuth();

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-primary text-xs font-bold mb-4">
          <span>⚓</span> Anchor Allocation Platform • Prototype Hub
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
          Intelligent Academia–Industry Allocation
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Candidate-proposing Deferred Acceptance matching over structurally separated Hard Eligibility (E), Soft Fit (F), and Opportunity Signal (O), governed by mandatory human review and immutable snapshots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {PERSONA_CARDS.map((card) => (
          <div
            key={card.role}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                  {card.badge}
                </span>
              </div>
              <h2 className="text-base font-bold text-on-surface mb-1">{card.title}</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                {card.description}
              </p>
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Connected Screens:
                </p>
                <div className="flex flex-wrap gap-1">
                  {card.screens.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-surface-container-low px-2 py-0.5 rounded text-on-surface border border-surface-container-highest"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href={card.href}
              onClick={() => switchRole(card.role)}
              className="mt-2 w-full text-center py-2 px-3 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors"
            >
              Enter as {card.title.split(" ")[0]} →
            </Link>
          </div>
        ))}
      </div>

      <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface-variant leading-relaxed">
        <h3 className="font-bold text-sm text-on-surface mb-2">Architectural Principles & Guarantees</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Structural E/F/O Separation:</strong> Hard eligibility (E &isin; &#123;0, 1&#125;) gates candidate inclusion; soft fit (F &isin; [0, 1]) and opportunity signal (O &isin; [0, 1]) combine into Priority (&alpha; &middot; F + (1 - &alpha;) &middot; O).</li>
          <li><strong>Mechanism Stability:</strong> Deferred Acceptance algorithm computes the candidate-optimal stable matching for declared preferences; overrides and recovery heuristics do not inherit DA stability claims.</li>
          <li><strong>Privacy by Construction:</strong> Allocation snapshots are strictly immutable without direct personal identities; identity resolution is physically decoupled via <code>subject_identity_mapping</code>.</li>
        </ul>
      </div>
    </div>
  );
}
