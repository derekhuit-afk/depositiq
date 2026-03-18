import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSubscriptionRecord } from "@/lib/db";
import { supabase } from "@/lib/db";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const product = process.env.NEXT_PUBLIC_PRODUCT_SLUG!;

  try {
    switch (event.type) {

      // ── New subscription created ──────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.metadata?.email;
        if (email) {
          await createSubscriptionRecord({
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
            customerEmail: email,
            product,
          });
          // Send welcome email via Resend
          await sendWelcomeEmail(email, product);
        }
        break;
      }

      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const email = sub.metadata?.customer_email;
        if (email) {
          await supabase.from("subscriptions").upsert({
            stripe_subscription_id: sub.id,
            stripe_customer_id: sub.customer as string,
            customer_email: email,
            vertical: "daas",
            tier: "COMMAND",
            interval: sub.items.data[0]?.price?.recurring?.interval || "month",
            source_product: product,
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          }, { onConflict: "stripe_subscription_id" });
        }
        break;
      }

      // ── Subscription updated (renewal, upgrade, downgrade) ───
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase.from("subscriptions")
          .update({
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      // ── Subscription cancelled ────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase.from("subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      // ── Payment succeeded ─────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabase.from("subscriptions")
            .update({ status: "active", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription as string);
        }
        break;
      }

      // ── Payment failed ────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabase.from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription as string);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // Still return 200 to prevent Stripe retries for handled event types
    return NextResponse.json({ received: true, warning: "Handler error logged" });
  }

  return NextResponse.json({ received: true });
}

// ── Email helper ──────────────────────────────────────────────────
async function sendWelcomeEmail(email: string, product: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME || product;
  const subdomain = process.env.NEXT_PUBLIC_SUBDOMAIN || `${product}.data.huit.ai`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${productName} <noreply@${subdomain}>`,
        to: email,
        subject: `Welcome to ${productName} — Your access is ready`,
        html: `
          <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:40px 20px;background:#050810;color:#E8EAF0;">
            <h1 style="font-size:28px;font-weight:900;margin-bottom:8px;">${productName}</h1>
            <p style="color:#9CA3AF;font-size:14px;margin-bottom:32px;">A Huit Data Ventures Company</p>
            <h2 style="font-size:20px;margin-bottom:16px;">Your subscription is active.</h2>
            <p style="font-size:15px;line-height:1.7;margin-bottom:24px;">
              Your dashboard is live and your data access is ready immediately.
            </p>
            <a href="https://${subdomain}/login" 
               style="display:inline-block;background:#00E5FF;color:#050810;padding:14px 32px;font-weight:900;text-decoration:none;font-size:15px;letter-spacing:1px;">
              ACCESS YOUR DASHBOARD →
            </a>
            <p style="margin-top:32px;font-size:13px;color:#6B7280;">
              Questions? Reply to this email or reach us at derek@huit.ai<br>
              Manage your subscription: <a href="https://${subdomain}/dashboard" style="color:#00E5FF;">Dashboard</a>
            </p>
            <p style="margin-top:24px;font-size:11px;color:#4B5563;">
              © 2026 ${productName} · Huit Data Ventures · data.huit.ai
            </p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error("Welcome email failed:", err);
  }
}

// Stripe type import (needed for TypeScript)
declare const Stripe: any;
