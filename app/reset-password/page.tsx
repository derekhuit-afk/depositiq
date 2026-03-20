"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error"|"invalid">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Supabase puts access_token in the URL hash after recovery link click
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#",""));
      const token = params.get("access_token");
      const type = params.get("type");
      // Also handle PKCE code flow (newer Supabase)
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      
      if (token && type === "recovery") {
        setAccessToken(token);
      } else if (code) {
        setAccessToken(code);
      } else if (!hash && !url.search) {
        setStatus("invalid");
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (!accessToken) { setError("Invalid or expired reset link. Please request a new one."); return; }
    
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to reset password"); setStatus("error"); return; }
      setStatus("done");
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "invalid") return (
    <div style={{ minHeight:"100vh", background:"#020B18", color:"#F0F4FF", fontFamily:"system-ui,sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔗</div>
        <h1 style={{ fontSize:24, fontWeight:900, marginBottom:12 }}>Invalid reset link</h1>
        <p style={{ color:"#8FA3C0", marginBottom:28, lineHeight:1.6 }}>This password reset link is invalid or has expired. Please request a new one.</p>
        <Link href="/forgot-password" style={{ background:"#3B82F6", color:"#020B18", padding:"12px 28px", borderRadius:8, fontWeight:700, textDecoration:"none", display:"inline-block" }}>Request New Link</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#020B18", color:"#F0F4FF", fontFamily:"system-ui,sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <h1 style={{ fontSize:28, fontWeight:900, marginBottom:8 }}>Set new password</h1>
        <p style={{ color:"#8FA3C0", fontSize:14, marginBottom:32 }}>Enter your new password below.</p>

        {status === "done" ? (
          <div style={{ background:"#3B82F615", border:"1px solid #3B82F640", borderRadius:10, padding:24, textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#3B82F6", marginBottom:8 }}>Password updated</div>
            <div style={{ fontSize:14, color:"#8FA3C0" }}>Redirecting you to sign in…</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div style={{ background:"#1A0808", border:"1px solid #FF4444", color:"#FF8888", padding:"12px 16px", fontSize:13, borderRadius:8, marginBottom:20 }}>{error}</div>}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, letterSpacing:"0.1em", color:"#8FA3C0", display:"block", marginBottom:8, textTransform:"uppercase" as const }}>New Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}
                placeholder="Min. 8 characters"
                style={{ width:"100%", background:"#FFFFFF0D", border:"1px solid #FFFFFF18", borderRadius:8, color:"#F0F4FF", padding:"12px 16px", fontSize:14, outline:"none", boxSizing:"border-box" as const }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, letterSpacing:"0.1em", color:"#8FA3C0", display:"block", marginBottom:8, textTransform:"uppercase" as const }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required
                placeholder="Repeat new password"
                style={{ width:"100%", background:"#FFFFFF0D", border:"1px solid #FFFFFF18", borderRadius:8, color:"#F0F4FF", padding:"12px 16px", fontSize:14, outline:"none", boxSizing:"border-box" as const }} />
            </div>
            <button type="submit" disabled={status==="loading"} style={{ width:"100%", background:status==="loading"?"#FFFFFF1A":"#3B82F6", color:"#020B18", border:"none", borderRadius:8, padding:"13px 0", fontSize:14, fontWeight:800, cursor:status==="loading"?"not-allowed":"pointer" }}>
              {status === "loading" ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
