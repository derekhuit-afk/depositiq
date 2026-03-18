import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const { data, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: name }
    });
    if (error && !error.message.includes("already"))
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, userId: data?.user?.id });
  } catch { return NextResponse.json({ error: "Signup failed" }, { status: 500 }); }
}
