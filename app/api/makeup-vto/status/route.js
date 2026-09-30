import { NextResponse } from "next/server";

// Polls a Perfect Corp makeup-vto task by id. See ../route.js for the
// "field names are a best-effort guess" caveat and why this 501s until
// PERFECTCORP_API_KEY is configured.
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
    `https://yce-api-01.makeupar.com/v2.0/task/makeup-vto/${encodeURIComponent(taskId)}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data?.error || "request_failed" }, { status: res.status });
  }
  return NextResponse.json(data?.data || {});
}
