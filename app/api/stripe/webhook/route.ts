import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSubscriptionRecord } from "@/lib/db";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  let event;
  try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }
  if (["customer.subscription.created","checkout.session.completed"].includes(event.type)) {
    const d = event.data.object as any;
    const email = d.customer_email || d.metadata?.customer_email;
    if (email) await createSubscriptionRecord({
      stripeSubscriptionId: d.subscription || d.id,
      stripeCustomerId: d.customer,
      customerEmail: email,
      product: d.metadata?.product || process.env.NEXT_PUBLIC_PRODUCT_SLUG!,
    });
  }
  return NextResponse.json({ received: true });
}
