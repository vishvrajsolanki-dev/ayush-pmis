"use client";

import React from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { RoleSwitcher } from "./RoleSwitcher";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ⚓
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">Anchor</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Allocation Platform
            </p>
          </div>
        </Link>
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold" title="Interactive demo dataset generated via Part 9 engine — outcomes are synthetic and never presented as real-world predictions">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          Synthetic Data
        </div>
      </div>

      <div className="flex items-center gap-4">
        <RoleSwitcher />
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200">
            {user?.name?.slice(0, 2).toUpperCase() || "US"}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-900">{user?.name || "User"}</p>
            <p className="text-[10px] text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="ml-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
