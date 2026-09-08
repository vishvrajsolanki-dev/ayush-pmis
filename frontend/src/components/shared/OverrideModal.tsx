"use client";

import React, { useState } from "react";
import { AllocationItem } from "@/lib/types/models";

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: AllocationItem;
  onConfirmOverride: (candidateId: string, targetOpportunityId: string, reason: string) => Promise<void>;
}

export function OverrideModal({
  isOpen,
  onClose,
  allocation,
  onConfirmOverride,
}: OverrideModalProps) {
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("A formal justification reason is mandatory for human allocation override.");
      return;
    }
    if (!targetId.trim()) {
      setError("Please select or enter the target opportunity ID.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await onConfirmOverride(allocation.candidateId || allocation.id, targetId, reason);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit override");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-lg w-full p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-3 mb-4">
          <h3 className="text-base font-bold text-on-surface">
            Admin Allocation Override
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-sm"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
          <strong>Important:</strong> Overriding a proposed allocation modifies the DA outcome. The original assignment, acting admin, decision, and mandatory reason are permanently stored as linked audit records. <em>Overridden results do not inherit the DA stability guarantee.</em>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Candidate
            </label>
            <input
              type="text"
              readOnly
              value={`${allocation.candidateName} (${allocation.candidateId})`}
              className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Currently Proposed Assignment
            </label>
            <input
              type="text"
              readOnly
              value={allocation.opportunityTitle || "Unmatched"}
              className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              New Target Opportunity ID <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. opp_02"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Mandatory Justification / Reason <span className="text-error">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Document the human governance rationale for this override..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-primary"
            />
          </div>

          {error && <p className="text-xs text-error font-medium">{error}</p>}

          <div className="flex justify-end gap-3 pt-3 border-t border-surface-container-highest">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting Override..." : "Record & Apply Override"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
