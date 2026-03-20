import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    // Always return success to prevent email enumeration
    if (error) {
      console.error("Password reset error:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password route error:", err);
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
  }
}
