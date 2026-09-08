"use client";

import React from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/lib/types/enums";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { role: UserRole.STUDENT, label: "Student", path: "/student/profile" },
  { role: UserRole.FACULTY, label: "Faculty", path: "/faculty/verification-queue" },
  { role: UserRole.PLACEMENT_CELL, label: "Placement Cell", path: "/placement-cell/analytics" },
  { role: UserRole.RECRUITER, label: "Recruiter", path: "/recruiter/opportunities" },
  { role: UserRole.MENTOR, label: "Mentor", path: "/mentor/assigned-candidates" },
  { role: UserRole.ADMIN, label: "Administrator", path: "/admin/organizations" },
];

export function RoleSwitcher() {
  const { role, switchRole } = useAuth();
  const router = useRouter();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value as UserRole;
    switchRole(selectedRole);
    const target = ROLE_OPTIONS.find((r) => r.role === selectedRole);
    if (target) {
      router.push(target.path);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
      <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        Active Persona:
      </span>
      <select
        value={role}
        onChange={handleRoleChange}
        className="bg-transparent text-sm font-semibold text-primary focus:outline-none cursor-pointer"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.role} value={opt.role}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
