"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { authApi } from "@/lib/api/auth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("ananya.sharma@ayush.edu.in");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { switchRole } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      switchRole(res.user.role);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full px-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl mx-auto mb-3">
            ⚓
          </div>
          <h2 className="text-xl font-bold text-on-surface">Sign In to Anchor</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Access your role-based allocation dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
              required
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-surface-container-highest text-center text-xs text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
