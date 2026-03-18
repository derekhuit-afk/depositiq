import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://vvkdnzqgtajeouxlliuk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2a2RuenFndGFqZW91eGxsaXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAwOTE4NiwiZXhwIjoyMDg2NTg1MTg2fQ.Q61WGhT0KHUbrVc3FiRzQN-vhmy53dEqaad4w4c_Z9o",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function getActiveSubscription(email: string, product: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("customer_email", email)
    .eq("source_product", product)
    .eq("status", "active")
    .single();
  return data;
}

export async function createSubscriptionRecord(d: {
  stripeSubscriptionId: string; stripeCustomerId: string;
  customerEmail: string; product: string;
}) {
  const { error } = await supabase.from("subscriptions").insert({
    stripe_subscription_id: d.stripeSubscriptionId,
    stripe_customer_id: d.stripeCustomerId,
    customer_email: d.customerEmail,
    vertical: "daas", tier: "COMMAND", interval: "month",
    source_product: d.product, status: "active",
  });
  return !error;
}
