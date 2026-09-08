"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recruiterApi } from "@/lib/api/recruiter";

export default function RecruiterCreateOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    capacity: 2,
    location: "Bengaluru",
    requiredSkills: "Biotechnology, Molecular Modeling",
    minYear: "4th Year",
    degreeMatch: "B.Tech Biotechnology",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await recruiterApi.createOpportunity({
      title: formData.title,
      description: formData.description,
      capacity: Number(formData.capacity),
      location: formData.location,
      requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
      eligibilityRequirements: {
        minYear: formData.minYear,
        degreeMatch: formData.degreeMatch,
      },
    });
    setLoading(false);
    router.push("/recruiter/opportunities");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Create Opportunity Posting</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Configure project requirements, capacity quota, and hard eligibility gates E(c, i)
        </p>
      </div>

      <Card padding="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Opportunity Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Clinical Research Intern"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Project Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe scope, responsibilities, and deliverables..."
              className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Seat Capacity (q_i)"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              required
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <Input
            label="Required Competencies (Comma-separated for Soft Fit F)"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
            <div className="col-span-2 text-xs font-bold text-on-surface">
              Hard Binary Eligibility Rules E(c, i) ∈ &#123;0, 1&#125;
            </div>
            <Input
              label="Minimum Academic Year"
              value={formData.minYear}
              onChange={(e) => setFormData({ ...formData, minYear: e.target.value })}
              required
            />
            <Input
              label="Required Degree Track"
              value={formData.degreeMatch}
              onChange={(e) => setFormData({ ...formData, degreeMatch: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/recruiter/opportunities")}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Publishing..." : "Publish Opportunity"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
