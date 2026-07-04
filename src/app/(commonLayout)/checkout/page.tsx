"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { cart, loading: cartLoading, totalPrice, refreshCart } = useCart();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [sessionPending, session, router]);

  async function handlePay() {
    setError("");
    setPaying(true);

    // 1. Turn the current cart into a PENDING order
    const orderRes = await fetch("/api/orders", { method: "POST" });
    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      setError(orderData.error || "Could not create the order.");
      setPaying(false);
      return;
    }

    // 2. Start the SSLCommerz payment session for that order
    const payRes = await fetch("/api/payment/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderData.order.id }),
    });
    const payData = await payRes.json();
    if (!payRes.ok) {
      setError(payData.error || "Could not start the payment.");
      setPaying(false);
      return;
    }

    await refreshCart();
    // 3. Send the browser to SSLCommerz's hosted payment page
    window.location.href = payData.gatewayUrl;
  }

  if (sessionPending || cartLoading) {
    return <p className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-muted">Loading…</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-muted">Your cart is empty — nothing to check out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Checkout</h1>

      <div className="mt-6 flex flex-col gap-2">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4">
        <span className="font-medium">Total</span>
        <span className="font-display text-xl font-semibold">${totalPrice.toFixed(2)}</span>
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      <Button size="lg" className="mt-6 w-full" onClick={handlePay} disabled={paying}>
        {paying ? "Redirecting to payment…" : "Pay with SSLCommerz"}
      </Button>
      <p className="mt-2 text-center text-xs text-muted">
        You&apos;ll be redirected to SSLCommerz&apos;s secure payment page to complete this purchase.
      </p>
    </div>
  );
}
