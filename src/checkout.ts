import { stripe } from "./stripeClient";
import { cartTotal } from "./cart";
import type { Cart, PaymentOutcome } from "./types";

export async function checkout(
  cart: Cart,
  customerId: string,
  paymentMethodId: string,
): Promise<PaymentOutcome> {
  const amount = cartTotal(cart);
  if (amount <= 0) {
    throw new Error("Cart total must be greater than zero");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: cart.currency,
    customer: customerId,
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    description: `Acme Shop order (${cart.items.length} items)`,
  });

  return { ok: paymentIntent.status === "succeeded", id: paymentIntent.id };
}
