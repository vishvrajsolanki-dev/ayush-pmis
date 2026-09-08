"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { facultyApi } from "@/lib/api/faculty";

export default function FacultyVerifyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const evidenceId = params.evidenceId as string;

  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async () => {
    setSubmitting(true);
    await facultyApi.verifyEvidence({
      evidenceId,
      comments,
      approved: true,
    });
    setSubmitting(false);
    router.push("/faculty/verification-queue");
  };

  const handleReject = async () => {
    setSubmitting(true);
    await facultyApi.verifyEvidence({
      evidenceId,
      comments,
      approved: false,
    });
    setSubmitting(false);
    router.push("/faculty/verification-queue");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Evaluate Evidence Submission</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Submission ID: <code className="font-mono text-primary font-bold">{evidenceId}</code>
        </p>
      </div>

      <Card padding="md">
        <CardHeader title="Artifact Information" subtitle="Uploaded student proof artifact" />
        <div className="space-y-3 text-xs mb-6">
          <div>
            <span className="text-on-surface-variant block">Artifact URL</span>
            <a
              href="#"
              className="text-primary font-semibold underline underline-offset-2"
            >
              https://github.com/ananya-sharma/lab-biotech-project
            </a>
          </div>
          <div>
            <span className="text-on-surface-variant block">Student Claim Description</span>
            <p className="text-on-surface font-medium mt-1">
              Authored CRISPR-Cas9 genome editing script and submitted protocol report as capstone coursework.
            </p>
          </div>
        </div>

        <div className="border-t border-outline-variant pt-4 space-y-4">
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant text-xs text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">Attestation Standard:</strong> Approving this evidence marks it with the exact status <code className="font-semibold text-primary">Verified by institution account</code>.
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Evaluator Notes / Department Justification
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide context regarding the verification..."
              className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleReject} disabled={submitting}>
              Reject Claim
            </Button>
            <Button size="sm" onClick={handleApprove} disabled={submitting}>
              {submitting ? "Processing..." : "Attest as Verified by Institution Account"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
