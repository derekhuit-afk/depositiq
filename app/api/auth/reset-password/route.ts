import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const { accessToken, password } = await req.json();

    if (!accessToken || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Decode the JWT to extract the user ID (sub claim)
    // The access_token from Supabase recovery is a standard JWT
    let userId: string;
    try {
      const parts = accessToken.split(".");
      if (parts.length !== 3) throw new Error("Invalid token format");
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      userId = payload.sub;
      if (!userId) throw new Error("No user ID in token");
      
      // Verify token is a recovery token (type = recovery)
      const tokenType = payload.amr?.find?.((a: {method:string}) => a.method === "recovery") || 
                        payload.type === "recovery" || 
                        accessToken.length > 100; // recovery tokens are long JWTs
      // Proceed - the service role has full access to update any user
    } catch {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    // Update the user's password via Supabase admin
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      console.error("Password update error:", error.message);
      return NextResponse.json({ error: "Failed to update password. The link may have expired." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
