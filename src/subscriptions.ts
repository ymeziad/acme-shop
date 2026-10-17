import { stripe } from "./stripeClient";
import type { PaymentOutcome } from "./types";

export type Plan = "basic" | "pro" | "team";

const PLAN_PRICES: Record<Plan, number> = {
  basic: 900,
  pro: 2900,
  team: 9900,
};

export function planPrice(plan: Plan): number {
  return PLAN_PRICES[plan];
}

export async function renewSubscription(
  plan: Plan,
  customerId: string,
  paymentMethodId: string,
): Promise<PaymentOutcome> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: planPrice(plan),
    currency: "usd",
    customer: customerId,
    payment_method: paymentMethodId,
    confirm: true,
    description: `Acme ${plan} plan renewal`,
    metadata: { plan },
  });

  return { ok: paymentIntent.status === "succeeded", id: paymentIntent.id };
}
