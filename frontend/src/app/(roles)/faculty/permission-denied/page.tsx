"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FacultyPermissionDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="max-w-xl w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-10 flex flex-col items-center text-center shadow-sm">
        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-6 text-2xl shadow-xs">
          🔒
        </div>

        {/* Headlines */}
        <h2 className="text-2xl font-bold text-primary mb-2">Access Restricted</h2>
        <p className="text-sm text-on-surface-variant mb-8 max-w-md leading-relaxed">
          You do not have the required permissions to verify this evidence. This student belongs to a different institution.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-xs">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant text-secondary rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-colors shadow-xs"
          >
            Go Back
          </button>
          <button
            onClick={() => alert("Access request logged and queued for institutional review.")}
            className="px-6 py-2.5 bg-primary-container text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}
