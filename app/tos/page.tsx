"use client";
import Link from "next/link";

export default function TermsOfService() {
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
          <h1 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, letterSpacing:"-0.02em", marginBottom:16 }}>Terms of Service</h1>
          <p style={{ fontSize:14, color:"#8FA3C0" }}>Last updated: March 2026 &nbsp;·&nbsp; Effective upon account creation</p>
        </div>

        {[
          ["1. Acceptance of Terms",
           "By creating an account or accessing DepositIQ, you agree to these Terms of Service and all applicable laws. If you do not agree, do not use this service. These terms constitute a binding legal agreement between you and Huit.AI, Inc."],
          ["2. Description of Service",
           "DepositIQ is a subscription-based software platform provided by Huit.AI, Inc. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time with reasonable notice to active subscribers."],
          ["3. Account Registration",
           "You must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorized access."],
          ["4. Subscription and Payment",
           "Access to DepositIQ requires an active paid subscription. Subscriptions are billed monthly or annually in advance. All fees are non-refundable except as required by law. We use Stripe for payment processing — by subscribing, you also agree to Stripe's terms of service."],
          ["5. Cancellation",
           "You may cancel your subscription at any time through your billing portal. Cancellation takes effect at the end of the current billing period. You retain access through the end of the period you have paid for."],
          ["6. Data and Privacy",
           "Your use of this service is also governed by our Privacy Policy. You retain ownership of your data. We do not sell your data to third parties. We use your data solely to provide, improve, and support the service."],
          ["7. Acceptable Use",
           "You agree not to: (a) use the service for any unlawful purpose; (b) attempt to gain unauthorized access to any part of the service; (c) reverse engineer or attempt to extract source code; (d) use the service to harm, harass, or deceive others; (e) resell or sublicense the service without written permission."],
          ["8. Intellectual Property",
           "All content, features, and functionality of DepositIQ are owned by Huit.AI, Inc. and are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the service for your internal business purposes."],
          ["9. Disclaimers",
           'The service is provided "as is" without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components. We disclaim all warranties to the fullest extent permitted by law.'],
          ["10. Limitation of Liability",
           "To the fullest extent permitted by law, Huit.AI, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim."],
          ["11. Governing Law",
           "These Terms are governed by the laws of the State of Delaware, USA, without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration in accordance with the AAA Commercial Arbitration Rules."],
          ["12. Changes to Terms",
           "We may update these Terms from time to time. We will notify active subscribers of material changes via email. Continued use of the service after changes constitutes acceptance of the new Terms."],
          ["13. Contact",
           "For questions about these Terms, contact us at legal@huit.ai or write to: Huit.AI, Inc., 1201 N Market St, Suite 111, Wilmington, DE 19801."],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom:36, paddingBottom:36, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:"#3B82F6", marginBottom:12 }}>{title}</h2>
            <p style={{ fontSize:15, color:"#C8D4E8", lineHeight:1.8 }}>{body.replace(/{name}/g, "DepositIQ")}</p>
          </div>
        ))}

        <div style={{ marginTop:48, padding:24, background:"rgba(255,255,255,0.04)", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize:13, color:"#8FA3C0", textAlign:"center", lineHeight:1.7 }}>
            Questions? Email us at <a href="mailto:legal@huit.ai" style={{ color:"#3B82F6", textDecoration:"none" }}>legal@huit.ai</a>
            &nbsp;·&nbsp; <Link href="/privacy" style={{ color:"#3B82F6", textDecoration:"none" }}>Privacy Policy</Link>
            &nbsp;·&nbsp; <Link href="/" style={{ color:"#3B82F6", textDecoration:"none" }}>Back to DepositIQ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
