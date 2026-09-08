import fs from 'fs';
import path from 'path';

const API_KEY = "AQ.Ab8RN6IPQMXCIJ56A6kLtmy3MusueqN-qBRgRkN-qi_GwfjmUA";
const ENDPOINT = "https://stitch.googleapis.com/mcp";
const PROJECT_ID = "14147166360881603789";

const SCREENS = [
  { id: "8c1c04dd5a9b4c5e920985e1ca2a557b", name: "FINAL_Student_Onboarding" },
  { id: "5326babbb6b54cccb6eaf947b78193a9", name: "FINAL_Student_Evidence" },
  { id: "404310bf24284776b02ec96aa08b131d", name: "FINAL_Faculty_VerificationQueue" },
  { id: "78a72feab75242178cdf67e86ce7ef94", name: "FINAL_Student_Profile" },
  { id: "89512e5bb9dd4aa2a8ea34776023a81e", name: "FINAL_Faculty_VerificationDetail_Success" },
  { id: "8d656eedea894ea9a63916f9b1024027", name: "FINAL_Faculty_VerificationDetail_Denied" },
  { id: "930f0fc01b8c4417b6525f187615a100", name: "FINAL_Student_Opportunities" },
  { id: "9baa3c8700484685a6ffc5c9c96ce718", name: "FINAL_Faculty_StudentRoster" },
  { id: "398c200a41cf424d9f79561732ea5e3e", name: "FINAL_PlacementCell_Analytics" },
  { id: "da1720733493477aa1f2a84214127d31", name: "FINAL_Student_Preferences" },
  { id: "4e34a3ccaf414553847df91592c8222b", name: "FINAL_Recruiter_SharedEvidence" },
  { id: "6d65326de4d04aecabb07ad946331178", name: "FINAL_Student_AllocationStatus" },
  { id: "28ab70cfc8684b3cbbdd4e7903ddecd7", name: "FINAL_Recruiter_OpportunityManagement" },
  { id: "655d13e67b084a929cff344710176ee4", name: "FINAL_Admin_OrganizationDetail" },
  { id: "715f26a198f848e8b5448ad5b56ed02b", name: "FINAL_Admin_ActivationQueue" },
  { id: "05e6ca91b92943e08396a8f7a6a40a10", name: "FINAL_Admin_AllocationRunsList" },
  { id: "789686321de24393a5b4f087c3e0da85", name: "FINAL_Admin_RecoveryDetail" },
  { id: "7a6f3a59c6084364a05704ea36391fa4", name: "FINAL_Admin_RecoveryQueue" },
  { id: "a343283b22e844c7bc69bf22fcbcb7a4", name: "FINAL_Admin_RunReview" },
  { id: "a70cc3a7ad474155a2adfbeb98c819a5", name: "FINAL_Admin_AuditLog" },
  { id: "ab3291344f684bd0b6114610326a129b", name: "FINAL_Admin_OverrideModal" },
  { id: "1505340c5ae1485b8c2a02d7ca369215", name: "FINAL_Mentor_AssignedCandidates_Default" },
  { id: "50b11ff4c0b44c6f94b1716506ac0dec", name: "FINAL_Mentor_AssignedCandidates_Loading" },
  { id: "6115da80dd254009b970a6e015cac389", name: "FINAL_Student_Evidence_CapReached" },
  { id: "81e2ad3f2c074319afc586b8eacd5c54", name: "FINAL_Faculty_PermissionDenied" },
  { id: "91d23f9dc73649ba8f1f547df556e8df", name: "FINAL_Institution_Analytics_InsufficientSample" },
  { id: "a63827dd85f84d1fb1f21138c8c78949", name: "FINAL_Admin_RunReview_Invalidated" },
  { id: "e02995307286427d83ffeea44f488b99", name: "FINAL_Mentor_AssignedCandidates_Empty" }
];

const outDir = path.resolve('stitch_screens');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function rpcCall(method, params) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: method,
        arguments: params
      }
    })
  });
  return res.json();
}

async function main() {
  console.log(`Fetching all ${SCREENS.length} screens from Stitch...`);
  for (let i = 0; i < SCREENS.length; i++) {
    const screen = SCREENS[i];
    console.log(`[${i + 1}/${SCREENS.length}] Fetching ${screen.name} (${screen.id})...`);
    try {
      const resp = await rpcCall("get_screen", {
        projectId: PROJECT_ID,
        screenId: screen.id
      });
      const rawText = resp.result?.content?.[0]?.text;
      const data = rawText ? JSON.parse(rawText) : resp.result;

      fs.writeFileSync(
        path.join(outDir, `${screen.name}.json`),
        JSON.stringify(data, null, 2),
        'utf8'
      );

      if (data.htmlCode?.downloadUrl) {
        const htmlRes = await fetch(data.htmlCode.downloadUrl);
        const htmlText = await htmlRes.text();
        fs.writeFileSync(
          path.join(outDir, `${screen.name}.html`),
          htmlText,
          'utf8'
        );
        console.log(`  -> Saved HTML (${htmlText.length} bytes)`);
      }
      console.log(`  -> Metadata saved`);
    } catch (err) {
      console.error(`  -> Error fetching ${screen.name}:`, err.message);
    }
  }
  console.log("All screens downloaded successfully!");
}

main();
