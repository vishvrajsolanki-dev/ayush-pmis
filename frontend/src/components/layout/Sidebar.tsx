"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/lib/types/enums";

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  [UserRole.STUDENT]: [
    { label: "Profile", href: "/student/profile", icon: "👤" },
    { label: "Evidence", href: "/student/evidence", icon: "📄" },
    { label: "Opportunities", href: "/student/opportunities", icon: "🔍" },
    { label: "Preferences", href: "/student/preferences", icon: "⭐" },
    { label: "Allocation Status", href: "/student/allocation-status", icon: "🎯" },
  ],
  [UserRole.FACULTY]: [
    { label: "Verification Queue", href: "/faculty/verification-queue", icon: "✅" },
    { label: "Student Roster", href: "/faculty/students", icon: "👥" },
  ],
  [UserRole.PLACEMENT_CELL]: [
    { label: "Analytics", href: "/placement-cell/analytics", icon: "📊" },
    { label: "Allocation Outcomes", href: "/placement-cell/allocation-outcomes", icon: "🎓" },
  ],
  [UserRole.RECRUITER]: [
    { label: "Opportunities", href: "/recruiter/opportunities", icon: "💼" },
    { label: "Shared Evidence", href: "/recruiter/shared-evidence", icon: "📁" },
  ],
  [UserRole.MENTOR]: [
    { label: "Assigned Candidates", href: "/mentor/assigned-candidates", icon: "🤝" },
  ],
  // Admin sidebar: Exactly 4 nav items
  [UserRole.ADMIN]: [
    { label: "Institutions/Companies", href: "/admin/organizations", icon: "🏛️" },
    { label: "Allocation Runs", href: "/admin/allocation-runs", icon: "⚙️" },
    { label: "Recovery Queue", href: "/admin/recovery", icon: "🔄" },
    { label: "Audit Log", href: "/admin/audit-log", icon: "📋" },
  ],
};

export function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  // Auto-derive effective role from pathname for direct URL navigation
  let effectiveRole = role;
  if (pathname.startsWith("/admin")) effectiveRole = UserRole.ADMIN;
  else if (pathname.startsWith("/faculty")) effectiveRole = UserRole.FACULTY;
  else if (pathname.startsWith("/placement-cell")) effectiveRole = UserRole.PLACEMENT_CELL;
  else if (pathname.startsWith("/recruiter")) effectiveRole = UserRole.RECRUITER;
  else if (pathname.startsWith("/mentor")) effectiveRole = UserRole.MENTOR;
  else if (pathname.startsWith("/student")) effectiveRole = UserRole.STUDENT;

  const navItems = NAV_BY_ROLE[effectiveRole] || [];
  const isAdmin = effectiveRole === UserRole.ADMIN;

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {effectiveRole.replace("_", " ")} Navigation
        </div>
        <nav className="space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/admin/organizations");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-700 text-white font-semibold shadow-sm"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {isAdmin ? (
        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Current Tenant: Global Administration</span>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Scope: Global Administration
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 shadow-sm">
          <p className="font-semibold text-indigo-700 mb-1">Anchor Engine</p>
          <p className="text-[11px] leading-tight text-slate-500">
            Candidate-proposing Deferred Acceptance with separate E/F/O scoring.
          </p>
        </div>
      )}
    </aside>
  );
}
