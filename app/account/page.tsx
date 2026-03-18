'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Account() {
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const router = useRouter();
  const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME || "Dashboard";
  const subdomain = process.env.NEXT_PUBLIC_SUBDOMAIN || "";
  const priceCents = parseInt(process.env.NEXT_PUBLIC_PRICE_CENTS || "0");

  async function openBillingPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Could not open billing portal. Please try again.");
    } catch { alert("Network error. Please try again."); }
    setPortalLoading(false);
  }

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #050810)" }}>
      <nav style={{ borderBottom: "1px solid #1E2235", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ fontWeight: 900, fontSize: "18px", color: "#00E5FF", textDecoration: "none" }}>
          ← Dashboard
        </Link>
        <button onClick={logout} style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer", fontSize: "13px" }}>
          Sign Out
        </button>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 32px" }}>
        <h1 style={{ fontWeight: 900, fontSize: "28px", marginBottom: "8px" }}>Account</h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "40px" }}>Manage your subscription and billing</p>

        {/* Subscription Card */}
        <div style={{ border: "1px solid #1E2235", background: "#080C1A", padding: "24px", marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", color: "#6B7280", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Active Subscription</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: "18px" }}>{productName}</div>
              <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>Monthly · ${(priceCents/100).toLocaleString()}/mo</div>
            </div>
            <div style={{ fontSize: "11px", color: "#00FF88", border: "1px solid #00FF8830", padding: "4px 12px" }}>ACTIVE</div>
          </div>
        </div>

        {/* Billing Portal Button */}
        <div style={{ border: "1px solid #1E2235", background: "#080C1A", padding: "24px", marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", color: "#6B7280", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Billing</div>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "16px" }}>
            Update payment method, download invoices, or cancel your subscription.
          </p>
          <button
            onClick={openBillingPortal}
            disabled={portalLoading}
            style={{ background: "#1E2235", border: "1px solid #2D3748", color: "#E8EAF0", padding: "10px 20px", cursor: portalLoading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600 }}
          >
            {portalLoading ? "Opening..." : "Manage Billing →"}
          </button>
        </div>

        {/* Data Access */}
        <div style={{ border: "1px solid #1E2235", background: "#080C1A", padding: "24px" }}>
          <div style={{ fontSize: "10px", color: "#6B7280", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Data Access</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
              <span style={{ color: "#00FF88" }}>✓</span> Live dashboard access
            </div>
            <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
              <span style={{ color: "#00FF88" }}>✓</span> CSV data export
            </div>
            <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
              <span style={{ color: "#00FF88" }}>✓</span> Monthly data refresh
            </div>
            <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
              <span style={{ color: "#00FF88" }}>✓</span> Email alerts on critical signals
            </div>
          </div>
        </div>

        <p style={{ marginTop: "32px", fontSize: "12px", color: "#4B5563", textAlign: "center" }}>
          Questions? Contact derek@huit.ai · {subdomain}
        </p>
      </div>
    </div>
  );
}
