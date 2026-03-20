"use client";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight:"100vh", background:"#020B18", color:"#F0F4FF", fontFamily:"system-ui,sans-serif" }}>
      <nav style={{ borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"20px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#3B82F6" }} />
          <span style={{ fontSize:15, fontWeight:800, color:"#F0F4FF" }}>DepositIQ</span>
        </Link>
        <Link href="/signup" style={{ fontSize:13, color:"#3B82F6", textDecoration:"none", fontWeight:600 }}>Create Account →</Link>
      </nav>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"64px 32px" }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:12, color:"#3B82F6", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Legal</div>
          <h1 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, letterSpacing:"-0.02em", marginBottom:16 }}>Privacy Policy</h1>
          <p style={{ fontSize:14, color:"#8FA3C0" }}>Last updated: March 2026 &nbsp;·&nbsp; Effective upon account creation</p>
        </div>

        {[
          ["Information We Collect",
           "We collect information you provide directly (name, email, payment information, company details) and information generated through your use of the service (usage data, queries, feature interactions, log data). We do not collect sensitive personal information beyond what is necessary to provide the service."],
          ["How We Use Your Information",
           "We use your information to: provide, operate, and improve DepositIQ; process payments and manage subscriptions; send service-related communications (receipts, security alerts, product updates); respond to support requests; and comply with legal obligations. We do not use your data for advertising."],
          ["Data Sharing",
           "We do not sell your personal information. We share data only with: (a) service providers who assist in operating our platform (Supabase for database, Stripe for payments, Vercel for hosting) under strict data processing agreements; (b) law enforcement when required by law; (c) successor entities in a merger or acquisition with advance notice to you."],
          ["Data Retention",
           "We retain your account data for as long as your account is active. After cancellation, we retain data for 90 days to allow account recovery, then delete it. Aggregated, anonymized usage statistics may be retained indefinitely. You can request immediate deletion by contacting privacy@huit.ai."],
          ["Security",
           "We implement industry-standard security measures including encryption at rest and in transit (TLS 1.3), access controls, regular security audits, and SOC 2-aligned practices. No method of transmission over the internet is 100% secure — we cannot guarantee absolute security."],
          ["Your Rights",
           "You have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data; export your data in a portable format; opt out of non-essential communications. To exercise these rights, contact privacy@huit.ai."],
          ["Cookies",
           "We use essential cookies to maintain your session and authentication state. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this may prevent you from accessing authenticated areas of the service."],
          ["Children's Privacy",
           "DepositIQ is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If we learn that we have collected personal information from a minor, we will delete it promptly."],
          ["International Data Transfers",
           "Your data may be processed in the United States and other countries. We ensure appropriate safeguards are in place for international transfers in compliance with applicable data protection laws."],
          ["Changes to This Policy",
           "We may update this Privacy Policy from time to time. We will notify you of material changes via email to your registered address. Continued use of the service after changes constitutes acceptance of the updated policy."],
          ["Contact",
           "For privacy-related questions or requests, contact us at privacy@huit.ai or write to: Huit.AI, Inc., 1201 N Market St, Suite 111, Wilmington, DE 19801."],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom:36, paddingBottom:36, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:"#3B82F6", marginBottom:12 }}>{title}</h2>
            <p style={{ fontSize:15, color:"#C8D4E8", lineHeight:1.8 }}>{body.replace(/{name}/g, "DepositIQ")}</p>
          </div>
        ))}

        <div style={{ marginTop:48, padding:24, background:"rgba(255,255,255,0.04)", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize:13, color:"#8FA3C0", textAlign:"center", lineHeight:1.7 }}>
            Questions? Email us at <a href="mailto:privacy@huit.ai" style={{ color:"#3B82F6", textDecoration:"none" }}>privacy@huit.ai</a>
            &nbsp;·&nbsp; <Link href="/tos" style={{ color:"#3B82F6", textDecoration:"none" }}>Terms of Service</Link>
            &nbsp;·&nbsp; <Link href="/" style={{ color:"#3B82F6", textDecoration:"none" }}>Back to DepositIQ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
