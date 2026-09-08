"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/types/enums";
import { authApi } from "@/lib/api/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [degreeTrack, setDegreeTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register({
        email,
        password,
        role,
        orgName,
        degreeTrack,
      });

      if (res.status === "PENDING") {
        router.push("/pending-activation");
      } else {
        router.push("/student/onboarding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full px-4 py-8">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-on-surface">Create an Account</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Register as a Student, Academic Institution, or Hiring Company
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
            >
              <option value={UserRole.STUDENT}>Student (Self-Service)</option>
              <option value={UserRole.FACULTY}>Academic Faculty (Requires Activation)</option>
              <option value={UserRole.PLACEMENT_CELL}>Placement Cell (Requires Activation)</option>
              <option value={UserRole.RECRUITER}>Company Recruiter (Requires Activation)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder={role === UserRole.STUDENT ? "student@university.edu" : "hr@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
              required
            />
          </div>

          {role !== UserRole.STUDENT && (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Organization Name
              </label>
              <input
                type="text"
                placeholder="e.g. Novartis Health Solutions / IIT Delhi"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
                required
              />
            </div>
          )}

          {role === UserRole.STUDENT && (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Degree Track & Year
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech Biotechnology (4th Year)"
                value={degreeTrack}
                onChange={(e) => setDegreeTrack(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
              required
            />
          </div>

          {role !== UserRole.STUDENT && (
            <div className="p-3 bg-surface-container-low rounded-lg text-[11px] text-on-surface-variant border border-surface-container-highest leading-relaxed">
              <strong>Notice:</strong> Institutional and Company accounts are provisioned in <code>PENDING</code> state and require Administrator approval before accessing verified workflows.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Complete Registration"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-surface-container-highest text-center text-xs text-on-surface-variant">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
