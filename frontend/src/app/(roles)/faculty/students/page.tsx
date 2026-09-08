"use client";

import React, { useState } from "react";

interface RosterStudent {
  id: string;
  name: string;
  studentId: string;
  program: string;
  progressPercent: number;
}

export default function FacultyStudentRosterPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const students: RosterStudent[] = [
    {
      id: "s-1",
      name: "Ananya Sharma",
      studentId: "stud_01_77a94",
      program: "B.Tech Biotechnology (4th Year)",
      progressPercent: 85,
    },
    {
      id: "s-2",
      name: "Marcus Thorne",
      studentId: "stud_02_38f12",
      program: "B.Tech Computer Science (4th Year)",
      progressPercent: 100,
    },
    {
      id: "s-3",
      name: "Julian Rossi",
      studentId: "stud_03_99c01",
      program: "M.Tech Bio-Engineering (2nd Year)",
      progressPercent: 40,
    },
    {
      id: "s-4",
      name: "Amina El-Sayed",
      studentId: "stud_04_55b88",
      program: "B.Tech Biotechnology (3rd Year)",
      progressPercent: 65,
    },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">👥</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Department Cohort
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Student Roster</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Review institutional candidate progress and verified evidence coverage across degree tracks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary shadow-xs w-56"
          />
          <button
            onClick={() => alert("Exporting official department cohort roster...")}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>📥</span> Export Roster
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">System ID</th>
                <th className="py-3.5 px-6">Academic Program</th>
                <th className="py-3.5 px-6">Evidence Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
                        {student.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-primary">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs text-secondary bg-surface-container px-2 py-1 rounded">
                      {student.studentId}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{student.program}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.progressPercent === 100
                              ? "bg-emerald-600"
                              : student.progressPercent >= 60
                              ? "bg-indigo-600"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${student.progressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-primary text-[11px]">
                        {student.progressPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing {filteredStudents.length} of {students.length} enrolled students</span>
          <span className="italic text-[11px] text-slate-500">
            Eligibility is based on independently attested skill claims.
          </span>
        </div>
      </div>
    </div>
  );
}
