# Anchor Frontend (SIH26044)

Anchor is a two-sided academia-industry allocation platform (SIH26044) designed to match students with internship and employment opportunities using candidate-proposing Deferred Acceptance matching. It enforces structural separation of eligibility ($E \in \{0, 1\}$), soft fit ($F \in [0, 1]$), and opportunity signals ($O \in [0, 1]$) into a unified Priority score ($Priority = \alpha \cdot F + (1 - \alpha) \cdot O$), with complete institutional governance, perturbation recovery, and privacy controls.

---

## Tech Stack

The application is built with the following verified core dependencies and configurations:

* **Framework:** [Next.js](https://nextjs.org/) `14.2.10` (App Router architecture with React `18.3.1`)
* **Language:** [TypeScript](https://www.typescriptlang.org/) `5.5.4` (`strict` mode enabled, ESNext target, `@/*` path alias to `src/*`)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) `3.4.19` with [Autoprefixer](https://github.com/postcss/autoprefixer) `10.5.5` and [PostCSS](https://postcss.org/) `8.5.28`
* **Utilities:** `clsx` (`2.1.1`), `tailwind-merge` (`2.5.2`), and [Lucide React](https://lucide.dev/) (`0.441.0`) icons
* **Testing & Visual QA:** [Playwright](https://playwright.dev/) (`1.63.0`) & `@playwright/test` (`1.63.0`)

---

## Getting Started

### Prerequisites

* Node.js v18.x or higher
* npm or pnpm package manager

### Installation

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start Next.js dev server:

```bash
npm run dev
```

By default, Next.js runs on `http://localhost:3000`. If port 3000 is occupied, run on custom port (e.g. 3001):

```bash
npx next dev -p 3001
```

> ⚠️ **Note:** Do not use port `20128` (reserved for local system proxy utilities).

### Available Scripts

* `npm run dev` — Starts Next.js dev server in development mode.
* `npm run build` — Compiles optimized production build (static page generation & type checking).
* `npm run start` — Starts Next.js production server from `.next` build output.
* `npm run lint` — Runs Next.js ESLint checker.

---

## Project Structure

The frontend application uses Next.js App Router grouped into authentication and role-based route handlers under `src/app`:

```text
frontend/src/app/
├── (auth)/                       # Authentication & Onboarding Flow Routes
│   ├── login/                    # /login - User sign-in interface
│   ├── register/                 # /register - Account registration across roles
│   └── pending-activation/       # /pending-activation - Pending institutional approval screen
├── (roles)/                      # Role-Scoped Navigation & Dashboards
│   ├── admin/                    # Platform Administrator screens
│   │   ├── allocation-runs/      # /admin/allocation-runs & /[runId] - Run creation & governance review
│   │   ├── audit-log/            # /admin/audit-log - System audit logs
│   │   ├── organizations/        # /admin/organizations & /[id] - Activation queue & org details
│   │   └── recovery/             # /admin/recovery & /[recoveryId] - Perturbation recovery queue & escalation
│   ├── faculty/                  # Academic Faculty screens
│   │   ├── permission-denied/    # /faculty/permission-denied - Cross-tenant authorization denied view
│   │   ├── students/             # /faculty/students - Department student roster
│   │   ├── verification-detail/  # /faculty/verification-detail/[id] - One-at-a-time claim verification
│   │   ├── verification-queue/   # /faculty/verification-queue - Evidence attestation queue
│   │   └── verify/               # /faculty/verify/[evidenceId] - Direct evidence review route
│   ├── mentor/                   # Industry Mentor screens
│   │   └── assigned-candidates/  # /mentor/assigned-candidates - Candidate tracking (Default, Empty, Loading)
│   ├── placement-cell/           # Institutional Placement Cell screens
│   │   ├── allocation-outcomes/  # /placement-cell/allocation-outcomes - Cohort outcome records
│   │   └── analytics/            # /placement-cell/analytics - Aggregate analytics with k-anonymity suppression
│   ├── recruiter/                # Hiring Company Recruiter screens
│   │   ├── opportunities/        # /recruiter/opportunities & /create - Job posting & management
│   │   └── shared-evidence/      # /recruiter/shared-evidence - View-only shared candidate evidence
│   └── student/                  # Student Candidate screens
│       ├── allocation-status/    # /student/allocation-status - Deferred Acceptance outcome status
│       ├── evidence/             # /student/evidence - Skill evidence management & cap simulation
│       ├── onboarding/           # /student/onboarding - Student profile onboarding wizard
│       ├── opportunities/        # /student/opportunities - Browse & explore open capacity
│       ├── preferences/          # /student/preferences - Rank order preference list submission
│       └── profile/              # /student/profile - Student profile overview
├── globals.css                   # Global Tailwind directives & custom CSS tokens
├── layout.tsx                    # Root application wrapper with AuthProvider header/sidebar
├── not-found.tsx                 # Custom 404 page
└── page.tsx                      # Prototype Navigation Hub / Landing page
```

---

## Personas & Roles

The frontend implements 6 distinct persona role views defined in `UserRole` ([src/lib/types/enums.ts](file:///c:/Users/DELL/ayush-pmis/frontend/src/lib/types/enums.ts#L1-L8)) and enforced via [Sidebar.tsx](file:///c:/Users/DELL/ayush-pmis/frontend/src/components/layout/Sidebar.tsx):

1. **Student (`STUDENT`):** Self-service profile onboarding, skill claim evidence submission (with cap reached guard), opportunity search, rank order preference submission, and Deferred Acceptance match outcome tracking.
2. **Faculty (`FACULTY`):** Department student roster browsing and strict **one-at-a-time** skill claim verification against official lab records, with cross-tenant permission enforcement.
3. **Placement Cell (`PLACEMENT_CELL`):** Institutional cohort placement tracking and aggregate outcome analytics with strict k-anonymity privacy suppression ($N \ge 10$).
4. **Recruiter (`RECRUITER`):** Internship/job opportunity creation and view-only shared candidate evidence review.
5. **Mentor (`MENTOR`):** Dedicated single-item dashboard for monitoring assigned candidate cohorts across Default, Empty, and Loading cycle states.
6. **Admin (`ADMIN`):** Platform governance oversight, tenant account activation, allocation run execution & policy alpha ($\alpha = 0.60$) enforcement, manual override execution with justification audit, perturbation recovery queue management, and immutable system audit logging. Always displays tenant indicator `"Current Tenant: Global Administration"`.

---

## Mock Data Mode

The application includes a transparent mock data layer enabling full offline development and visual QA without requiring an active backend connection.

* **Configuration:** Controlled by `NEXT_PUBLIC_USE_MOCK` in [src/lib/api/client.ts](file:///c:/Users/DELL/ayush-pmis/frontend/src/lib/api/client.ts#L7). Mock mode is **active by default** unless explicitly set to `NEXT_PUBLIC_USE_MOCK=false` with a running backend at `NEXT_PUBLIC_API_URL`.
* **Fallback Behavior:** If a live API fetch call fails, `apiFetch` gracefully falls back to mock responses from `src/lib/api/mocks/mockData.ts`.
* **Interactive State Switchers:** Screens feature top state simulation bars allowing real-time switching between cycle states (e.g. Matched vs. Pending vs. Recovery; Standard Review vs. Invalidated Run; N < 10 Privacy Suppressed vs. Authorized).

---

## Visual QA & Spec Compliance

### Automated Playwright QA Suite

Visual compliance is verified using Playwright against all 28 spec screens and multi-state variants (29 states total).

* **Test Script:** [scripts/run-visual-qa.mjs](file:///c:/Users/DELL/ayush-pmis/frontend/scripts/run-visual-qa.mjs)
* **Execution Command:**
  ```bash
  $env:BASE_URL="http://localhost:3001"; node scripts/run-visual-qa.mjs
  ```
* **Checked Invariants:**
  1. No banned "confidence" terminology (outputs are priority tiers only).
  2. No banned Faculty bulk/batch verification controls.
  3. No banned financial/ledger terms (`$`, `₹`, `Ledger`, `Risk Tier`, `Tax ID`).
  4. No banned cryptographic display copy (`SHA-256`, raw `2.0x` multipliers).
  5. Exact character-for-character Admin scope indicator (`"Current Tenant: Global Administration"` / `"Scope: Global Administration"`).
  6. Zero browser console or unhandled React errors.
* **Artifacts & Results:**
  * Screen Capture Directory: `frontend/qa-screenshots/` (29 `.png` full-page captures)
  * QA Results Report: [frontend/QA_RESULTS.json](file:///c:/Users/DELL/ayush-pmis/frontend/QA_RESULTS.json) (**29 / 29 PASS — 100% Compliance**)

### Design Spec Compliance

The frontend adheres strictly to [DESIGN.md](file:///c:/Users/DELL/ayush-pmis/DESIGN.md) Section 3 (the 14 global product & copy rules). Key compliance points include:
* Policy Alpha ($\alpha = 0.60$) recorded per run, never varying row-by-row.
* Priority Tiers display explicit signal sources (`Model` vs. `Fallback`).
* Recovery operations explicitly labeled `"locally stable heuristic"`.
* Verification status rendered as `"Verified by institution account"`.
* Status badges mapped to 7 distinct color categories (`DRAFT`, `PROPOSED`, `UNDER_REVIEW`, `APPROVED`, `OVERRIDDEN`, `INVALIDATED`, `PUBLISHED`).
* Synthetic data clearly labeled `"Synthetic Data"` on all outcomes.

---

## CI Status

* **Current Status:** The root repository CI workflow (`.github/workflows/ci.yml`) runs backend environment checks. There is currently no automated GitHub Actions CI pipeline dedicated to building or testing the frontend.
* **Local Verification:** All frontend builds (`npm run build`) and Playwright visual QA suites are verified locally prior to main branch commits.

---

## Known Limitations & Future Work

* **Backend Integration:** The FastAPI backend is currently under development; API calls utilize frontend mock fallback handlers.
* **Automated Unit Tests:** Unit/component testing (e.g. Vitest / React Testing Library) is not yet implemented; verification is currently driven by Next.js static typechecking, build verification, and Playwright Visual QA.
