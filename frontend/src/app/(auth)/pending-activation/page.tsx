import Link from "next/link";

export default function PendingActivationPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full px-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-8 shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ⏳
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-2">Account Pending Activation</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
          Your organization account has been created with status <code className="bg-amber-50 px-1.5 py-0.5 rounded text-amber-900 font-mono">PENDING</code>. Per platform governance policies, an Administrator must verify institutional credentials before access is granted.
        </p>

        <div className="p-4 bg-surface-container-low border border-surface-container-highest rounded-xl text-left text-xs space-y-2 mb-6">
          <p className="font-semibold text-on-surface">Next Steps:</p>
          <ul className="list-disc list-inside text-on-surface-variant text-[11px] space-y-1">
            <li>Platform Admin reviews domain & registration.</li>
            <li>Verification status updates to <code>ACTIVATED</code>.</li>
            <li>Email confirmation sent upon approval.</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors"
        >
          Return to Prototype Hub
        </Link>
      </div>
    </div>
  );
}
