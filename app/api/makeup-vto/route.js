import { NextResponse } from "next/server";

// Starts a Perfect Corp "AI 메이크업 가상 체험" (AI Makeup Virtual Try-On /
// makeup-vto) task — applies ONE specific product's color/texture (not a
// reference-photo transfer) onto a selfie. For 뷰티랩's "발라보기" (currently
// hidden, see CLAUDE.md), not the lookfinder transfer flow (/api/makeup-transfer).
//
// ⚠ Field names here (src_file_url / src_file_id, version, effects) are a
// best-effort guess based on the sibling AI Makeup Transfer API's naming
// (same vendor, same "V1.0" family, same async task pattern) — the makeup-vto
// team only shared prose docs + a playground link, not the full OpenAPI spec
// like mu-transfer got. Verify against the API Playground
// (http://yce.makeupar.com/api-console/en/api-playground/ai-makeup-virtual-try-on/)
// once a real key exists, before trusting this in production.
//
// PERFECTCORP_API_KEY not set yet → always 501 "not_configured", same as
// /api/makeup-transfer. Not wired into any UI yet (뷰티랩 발라보기 entry point
// is still intentionally hidden pending a quality decision — see CLAUDE.md).
export async function POST(request) {
  const apiKey = process.env.PERFECTCORP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const { srcUrl, effects } = await request.json();
  if (!srcUrl || !Array.isArray(effects)) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const res = await fetch("https://yce-api-01.makeupar.com/v2.0/task/makeup-vto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ version: "1.0", src_file_url: srcUrl, effects }),
  });
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data?.error || data?.error_code || "request_failed" }, { status: res.status });
  }
  return NextResponse.json({ taskId: data?.data?.task_id });
}
