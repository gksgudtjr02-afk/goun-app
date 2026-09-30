import { NextResponse } from "next/server";

// Polls a Perfect Corp AI Makeup Transfer task by id. See ../route.js for
// why this 501s until PERFECTCORP_API_KEY is configured.
export async function GET(request) {
  const apiKey = process.env.PERFECTCORP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const taskId = new URL(request.url).searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ error: "missing_task_id" }, { status: 400 });
  }

  const res = await fetch(
    `https://yce-api-01.makeupar.com/s2s/v2.0/task/mu-transfer/${encodeURIComponent(taskId)}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  const data = await res.json();

  if (!res.ok) {
    console.error("[makeup-transfer/status] poll-failed", res.status, JSON.stringify(data));
    return NextResponse.json({ error: data?.error || "request_failed" }, { status: res.status });
  }
  console.log("[makeup-transfer/status] poll", JSON.stringify(data));
  return NextResponse.json(data?.data || {});
}
