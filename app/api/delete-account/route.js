import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createAdminClient } from "@/lib/supabaseAdmin";

// Deletes the currently signed-in user's account and all related data.
// Runs server-side only: identifies the user from their session cookie,
// then uses the service role key (never exposed to the browser) to
// actually remove the auth.users row. Tables with `on delete cascade`
// (profiles, point_history, wishlist_items) are cleaned up automatically.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
