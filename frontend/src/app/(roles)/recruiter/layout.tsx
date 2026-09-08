"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { RoleGuard } from "@/lib/auth/RoleGuard";
import { UserRole } from "@/lib/types/enums";

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.RECRUITER, UserRole.ADMIN]}>
      <div className="flex w-full min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-background">{children}</div>
      </div>
    </RoleGuard>
  );
}
