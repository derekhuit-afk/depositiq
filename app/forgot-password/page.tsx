"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"sent"|"error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send reset email"); setStatus("error"); return; }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020B18", color: "#F0F4FF", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/login" style={{ color: "#8FA3C0", fontSize: 12, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>← Back to Sign In</Link>

        <h1 style={{ fontSize: 28, fontWeight: 900, marginTop: 24, marginBottom: 8 }}>Reset your password</h1>
        <p style={{ color: "#8FA3C0", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>Enter your email address and we'll send you a link to reset your password.</p>

        {status === "sent" ? (
          <div style={{ background: "#3B82F615", border: "1px solid #3B82F640", borderRadius: 10, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6", marginBottom: 8 }}>Check your email</div>
            <div style={{ fontSize: 14, color: "#8FA3C0", lineHeight: 1.6 }}>We sent a password reset link to <strong style={{ color: "#F0F4FF" }}>{email}</strong>. Check your inbox and follow the instructions.</div>
            <div style={{ fontSize: 12, color: "#8FA3C0", marginTop: 16 }}>Didn't receive it? Check your spam folder or <button onClick={()=>setStatus("idle")} style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontSize: 12, padding: 0 }}>try again</button>.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div style={{ background: "#1A0808", border: "1px solid #FF4444", color: "#FF8888", padding: "12px 16px", fontSize: 13, borderRadius: 8, marginBottom: 20 }}>{error}</div>}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, letterSpacing: "0.1em", color: "#8FA3C0", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@company.com"
                style={{ width: "100%", background: "#FFFFFF0D", border: "1px solid #FFFFFF18", borderRadius: 8, color: "#F0F4FF", padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" as const }}
              />
            </div>
            <button type="submit" disabled={status === "loading"} style={{ width: "100%", background: status==="loading" ? "#FFFFFF1A" : "#3B82F6", color: "#020B18", border: "none", borderRadius: 8, padding: "13px 0", fontSize: 14, fontWeight: 800, cursor: status==="loading" ? "not-allowed" : "pointer", letterSpacing: "0.05em" }}>
              {status === "loading" ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#8FA3C0" }}>
          Remember your password? <Link href="/login" style={{ color: "#3B82F6", textDecoration: "none" }}>Sign In →</Link>
        </p>
      </div>
    </div>
  );
}
