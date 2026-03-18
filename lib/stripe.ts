import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession({
  email, priceId, product, successUrl, cancelUrl,
}: { email: string; priceId: string; product: string; successUrl: string; cancelUrl: string; }) {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"], mode: "subscription",
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl, cancel_url: cancelUrl,
    metadata: { product, email },
    subscription_data: { metadata: { product, customer_email: email } },
  });
}
