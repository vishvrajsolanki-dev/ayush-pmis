import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../qa-screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Banned patterns
const BANNED_PATTERNS = [
  { name: "confidence", regex: /\bconfidence\b/i },
  { name: "financial_dollar", regex: /\$/ },
  { name: "financial_rupee", regex: /₹/ },
  { name: "financial_ledger", regex: /\bledger\b/i },
  { name: "financial_risk_tier", regex: /\brisk tier\b/i },
  { name: "financial_tax_id", regex: /\btax id\b/i },
  { name: "crypto_sha256", regex: /\bsha-256\b/i },
  { name: "multiplier_2x", regex: /\b2\.0x\b/i },
  { name: "multiplier_1x", regex: /\b1\.0x\b/i },
  { name: "academic_transcript", regex: /\btranscripts?\b/i },
  { name: "academic_gpa", regex: /\bGPA\b/i },
  { name: "academic_standing", regex: /\bacademic standing\b/i },
];

const ADMIN_SCOPE_REQUIRED = [
  "Current Tenant: Global Administration",
  "Scope: Global Administration",
];

const SCREENS = [
  {
    id: 1,
    role: "Student",
    screen: "Onboarding",
    route: "/student/onboarding",
    filename: "01_student_onboarding.png",
  },
  {
    id: 2,
    role: "Student",
    screen: "Profile",
    route: "/student/profile",
    filename: "02_student_profile.png",
  },
  {
    id: 3,
    role: "Student",
    screen: "Evidence Management",
    route: "/student/evidence",
    filename: "03_student_evidence.png",
  },
  {
    id: 4,
    role: "Student",
    screen: "Opportunities Browse",
    route: "/student/opportunities",
    filename: "04_student_opportunities.png",
  },
  {
    id: 5,
    role: "Student",
    screen: "Preference Submission",
    route: "/student/preferences",
    filename: "05_student_preferences.png",
  },
  {
    id: 6,
    role: "Student",
    screen: "Allocation Status",
    route: "/student/allocation-status",
    filename: "06_student_allocation_status.png",
  },
  {
    id: 7,
    role: "Faculty",
    screen: "Verification Queue",
    route: "/faculty/verification-queue",
    filename: "07_faculty_verification_queue.png",
    customCheck: (text) => {
      const batchRegex = /\b(batch verify|bulk verify|verify all|batch approve)\b/i;
      if (batchRegex.test(text)) {
        return "Found batch action language on Faculty Verification Queue: " + text.match(batchRegex)[0];
      }
      return null;
    },
  },
  {
    id: 8,
    role: "Faculty",
    screen: "Verification Detail — Success",
    route: "/faculty/verification-detail/ev-1",
    filename: "08_faculty_verification_detail_success.png",
    action: async (page) => {
      const btn = page.locator("button:has-text('Authorized Claim')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: "8b",
    role: "Faculty",
    screen: "Verification Detail — Denied",
    route: "/faculty/verification-detail/ev-1",
    filename: "08b_faculty_verification_detail_denied.png",
    action: async (page) => {
      const btn = page.locator("button:has-text('Cross-Institution Denied')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: 9,
    role: "Faculty",
    screen: "Student Roster",
    route: "/faculty/students",
    filename: "09_faculty_student_roster.png",
  },
  {
    id: 10,
    role: "Placement Cell",
    screen: "Analytics / Allocation Outcomes",
    route: "/placement-cell/analytics",
    filename: "10_placement_cell_analytics.png",
  },
  {
    id: 11,
    role: "Recruiter",
    screen: "Opportunity Management",
    route: "/recruiter/opportunities",
    filename: "11_recruiter_opportunities.png",
  },
  {
    id: 12,
    role: "Recruiter",
    screen: "Shared Evidence (view-only)",
    route: "/recruiter/shared-evidence",
    filename: "12_recruiter_shared_evidence.png",
  },
  {
    id: 13,
    role: "Admin",
    screen: "Activation Queue",
    route: "/admin/organizations",
    filename: "13_admin_activation_queue.png",
    isAdmin: true,
  },
  {
    id: 14,
    role: "Admin",
    screen: "Organization Detail",
    route: "/admin/organizations/org-1",
    filename: "14_admin_organization_detail.png",
    isAdmin: true,
  },
  {
    id: 15,
    role: "Admin",
    screen: "Allocation Runs List",
    route: "/admin/allocation-runs",
    filename: "15_admin_allocation_runs_list.png",
    isAdmin: true,
  },
  {
    id: 16,
    role: "Admin",
    screen: "Run Review",
    route: "/admin/allocation-runs/run-1",
    filename: "16_admin_run_review.png",
    isAdmin: true,
  },
  {
    id: 17,
    role: "Admin",
    screen: "Override Modal",
    route: "/admin/allocation-runs/run-1",
    filename: "17_admin_override_modal.png",
    isAdmin: true,
    action: async (page) => {
      const overrideBtn = page.locator("button:has-text('Override')").first();
      if (await overrideBtn.isVisible()) {
        await overrideBtn.click();
        await page.waitForTimeout(400);
      }
    },
  },
  {
    id: 18,
    role: "Admin",
    screen: "Recovery Queue",
    route: "/admin/recovery",
    filename: "18_admin_recovery_queue.png",
    isAdmin: true,
  },
  {
    id: 19,
    role: "Admin",
    screen: "Recovery Detail / Escalate",
    route: "/admin/recovery/rec-1",
    filename: "19_admin_recovery_detail.png",
    isAdmin: true,
  },
  {
    id: 20,
    role: "Admin",
    screen: "Audit Log",
    route: "/admin/audit-log",
    filename: "20_admin_audit_log.png",
    isAdmin: true,
  },
  {
    id: 21,
    role: "Mentor",
    screen: "Assigned Candidates — Default",
    route: "/mentor/assigned-candidates",
    filename: "21_mentor_assigned_candidates_default.png",
    action: async (page) => {
      const btn = page.locator("button:has-text('Default View')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: 22,
    role: "Mentor",
    screen: "Assigned Candidates — Empty",
    route: "/mentor/assigned-candidates",
    filename: "22_mentor_assigned_candidates_empty.png",
    action: async (page) => {
      const btn = page.locator("button:has-text('Empty Cycle State')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: 23,
    role: "Mentor",
    screen: "Assigned Candidates — Loading",
    route: "/mentor/assigned-candidates",
    filename: "23_mentor_assigned_candidates_loading.png",
    action: async (page) => {
      const btn = page.locator("button:has-text('Loading State')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: 24,
    role: "Faculty",
    screen: "Permission-Denied (cross-institution)",
    route: "/faculty/permission-denied",
    filename: "24_faculty_permission_denied.png",
  },
  {
    id: 25,
    role: "Student",
    screen: "Evidence — Cap-Reached",
    route: "/student/evidence",
    filename: "25_student_evidence_cap_reached.png",
    action: async (page) => {
      const btn = page.locator("button:has-text('Simulate Cap Reached')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: 26,
    role: "Institution",
    screen: "Analytics — Insufficient-Sample-Size",
    route: "/placement-cell/analytics",
    filename: "26_institution_analytics_insufficient_sample.png",
    action: async (page) => {
      const btn = page.locator("button:has-text('Public Policy')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: 27,
    role: "Admin",
    screen: "Run Review — Invalidated",
    route: "/admin/allocation-runs/run-1",
    filename: "27_admin_run_review_invalidated.png",
    isAdmin: true,
    action: async (page) => {
      const btn = page.locator("button:has-text('Invalidated Run')");
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    id: 28,
    role: "Placement Cell",
    screen: "Allocation Outcomes",
    route: "/placement-cell/allocation-outcomes",
    filename: "28_placement_cell_allocation_outcomes.png",
  },
];

async function runVisualQA() {
  console.log(`Starting Visual QA against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(`console.error: ${message.text()}`);
  });

  const results = [];

  for (const item of SCREENS) {
    const url = `${BASE_URL}${item.route}`;
    console.log(`[Screen ${item.id}] Testing ${item.role} - ${item.screen} (${url})...`);

    try {
      const errorsAtStart = browserErrors.length;
      try {
        await page.goto(url, { waitUntil: "networkidle" });
      } catch (firstNavigationError) {
        // Next dev may invalidate a single navigation during hot reload; retry once
        // before treating a route as unavailable.
        await page.goto(url, { waitUntil: "networkidle" });
      }
      await page.waitForTimeout(500);

      if (item.action) {
        await item.action(page);
      }

      const screenshotPath = path.join(OUTPUT_DIR, item.filename);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Get page inner text
      const pageText = await page.evaluate(() => document.body.innerText);

      // Check banned patterns
      const violations = [];
      for (const { name, regex } of BANNED_PATTERNS) {
        if (regex.test(pageText)) {
          const match = pageText.match(regex);
          violations.push(`${name} (found: "${match ? match[0] : ''}")`);
        }
      }

      // Check custom
      if (item.customCheck) {
        const customErr = item.customCheck(pageText);
        if (customErr) violations.push(customErr);
      }

      const screenErrors = browserErrors.slice(errorsAtStart);
      if (screenErrors.length) violations.push(...screenErrors);

      // Check Admin scope
      let adminScopePass = true;
      if (item.isAdmin) {
        for (const req of ADMIN_SCOPE_REQUIRED) {
          if (!pageText.includes(req)) {
            violations.push(`Admin scope missing: "${req}"`);
            adminScopePass = false;
          }
        }
      }

      const pass = violations.length === 0;
      results.push({
        id: item.id,
        role: item.role,
        screen: item.screen,
        route: item.route,
        filename: item.filename,
        pass,
        violations,
        noConfidence: !violations.some((v) => v.startsWith("confidence")),
        noBatchVerify: !violations.some((v) => v.toLowerCase().includes("batch")),
        noFinancial: !violations.some((v) => v.startsWith("financial")),
        noCryptoMultiplier: !violations.some((v) => v.startsWith("crypto") || v.startsWith("multiplier")),
        adminScopeOk: !item.isAdmin || adminScopePass,
      });

      console.log(`  -> ${pass ? "✅ PASS" : "❌ FAIL"}: ${item.filename} ${violations.length ? `(${violations.join(", ")})` : ""}`);
    } catch (err) {
      console.error(`  -> ❌ ERROR testing screen ${item.id}:`, err);
      results.push({
        id: item.id,
        role: item.role,
        screen: item.screen,
        route: item.route,
        filename: item.filename,
        pass: false,
        error: err.message,
      });
    }
  }

  await browser.close();

  const reportPath = path.join(__dirname, "../QA_RESULTS.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nVisual QA complete! Processed ${results.length} screens. Report saved to QA_RESULTS.json`);
}

runVisualQA().catch((err) => {
  console.error("Fatal QA Error:", err);
  process.exit(1);
});
