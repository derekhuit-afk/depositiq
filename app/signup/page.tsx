'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!agreedToTerms) { setError("You must agree to the Terms of Service and Privacy Policy to continue."); return; }
    setLoading(true); setError("");
    const sr = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
    const sd = await sr.json();
    if (!sr.ok && !sd.success) { setError(sd.error || "Signup failed"); setLoading(false); return; }
    const cr = await fetch("/api/stripe/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const cd = await cr.json();
    if (cd.url) window.location.href = cd.url;
    else { setError("Checkout failed"); setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Link href="/" style={{ color: "#6B7280", fontSize: "12px", textDecoration: "none", letterSpacing: "2px" }}>← BACK</Link>
        <h1 style={{ fontWeight: 900, fontSize: "28px", marginTop: "24px", marginBottom: "8px" }}>Create Account</h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "32px" }}>You will be redirected to checkout.</p>
        {error && <div style={{ background: "#1A0808", border: "1px solid #FF4444", color: "#FF8888", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "2px", color: "#6B7280", display: "block", marginBottom: "6px" }}>FULL NAME</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              style={{ width: "100%", background: "#0C0E1A", border: "1px solid #1E2235", color: "#E8EAF0", padding: "12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "2px", color: "#6B7280", display: "block", marginBottom: "6px" }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: "100%", background: "#0C0E1A", border: "1px solid #1E2235", color: "#E8EAF0", padding: "12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "2px", color: "#6B7280", display: "block", marginBottom: "6px" }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              style={{ width: "100%", background: "#0C0E1A", border: "1px solid #1E2235", color: "#E8EAF0", padding: "12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
                    {/* ToS Agreement */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:20 }}>
            <input
              type="checkbox"
              id="tos-agree"
              checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              style={{ marginTop:2, width:16, height:16, cursor:"pointer", accentColor:"#3B82F6", flexShrink:0 }}
            />
            <label htmlFor="tos-agree" style={{ fontSize:13, color:"#8FA3C0", lineHeight:1.6, cursor:"pointer" }}>
              I agree to the{" "}
              <a href="/tos" target="_blank" rel="noopener noreferrer" style={{ color:"#3B82F6", textDecoration:"none", fontWeight:600 }}>Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color:"#3B82F6", textDecoration:"none", fontWeight:600 }}>Privacy Policy</a>.
              By creating an account I confirm I am 18 or older.
            </label>
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", background: "#00E5FF", color: "#050810", padding: "14px", fontWeight: 900, fontSize: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "PROCESSING..." : "CREATE ACCOUNT & SUBSCRIBE"}
          </button>
        </form>
        <p style={{ marginTop: "16px", fontSize: "11px", color: "#4B5563", textAlign: "center" }}>Immediate access upon payment. Cancel anytime.</p>
      </div>
    </div>
  );
}
