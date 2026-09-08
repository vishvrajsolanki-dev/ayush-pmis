import fs from 'fs';

const API_KEY = "AQ.Ab8RN6IPQMXCIJ56A6kLtmy3MusueqN-qBRgRkN-qi_GwfjmUA";
const ENDPOINT = "https://stitch.googleapis.com/mcp";
const PROJECT_ID = "14147166360881603789";

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
  const resp = await rpcCall("get_screen", {
    projectId: PROJECT_ID,
    screenId: "8c1c04dd5a9b4c5e920985e1ca2a557b"
  });
  console.log("Response structure:", JSON.stringify(resp, null, 2).slice(0, 1000));
}

main();
