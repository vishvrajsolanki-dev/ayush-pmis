import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center mx-auto">
      <div className="w-16 h-16 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-4 text-2xl font-bold">
        404
      </div>
      <h2 className="text-xl font-bold text-on-surface mb-2">Screen Not Found</h2>
      <p className="text-sm text-on-surface-variant max-w-md mb-6">
        The requested screen does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:opacity-90"
      >
        Return to Prototype Hub
      </Link>
    </div>
  );
}
