import { NextResponse } from "next/server";

// Starts a Perfect Corp "AI Makeup Transfer" task: applies the makeup style
// from a reference photo onto a source (selfie) photo. Runs server-side only
// so the secret API key never reaches the browser. Both photo URLs must
// already be publicly reachable (uploaded to Supabase Storage by the caller
// before hitting this route).
//
// PERFECTCORP_API_KEY is not set yet (2026-09, pending sign-up) — until it
// is, this always responds 501 "not_configured" and the client falls back
// to the free MediaPipe engine. Add the key as a Vercel env var to switch on.
export async function POST(request) {
  const apiKey = process.env.PERFECTCORP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const { srcUrl, refUrl } = await request.json();
  if (!srcUrl || !refUrl) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const res = await fetch("https://yce-api-01.makeupar.com/s2s/v2.0/task/mu-transfer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ src_file_url: srcUrl, ref_file_url: refUrl }),
  });
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data?.error || data?.error_code || "request_failed" }, { status: res.status });
  }
  return NextResponse.json({ taskId: data?.data?.task_id });
}
