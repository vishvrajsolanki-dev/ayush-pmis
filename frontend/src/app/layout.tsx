import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Anchor — Adaptive Allocation Platform",
  description: "Candidate-proposing Deferred Acceptance allocation with structural E/F/O separation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="font-sans bg-background text-on-background min-h-screen">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
