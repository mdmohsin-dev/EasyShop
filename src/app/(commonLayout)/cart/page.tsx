"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Tag } from "lucide-react";

export default function CartPage() {
  const { cart, loading, increment, decrement, removeFromCart, totalPrice } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  if (loading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-muted">Loading your cart…</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Add something from the shop to see it here.</p>
        <Link href="/">
          <Button className="mt-6">Browse the shop</Button>
        </Link>
      </div>
    );
  }

  function handleCheckout() {
    if (!session?.user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  }



  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Your cart</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* Right on desktop, but shown FIRST on mobile */}
        <div className="order-first flex flex-col gap-4 lg:order-last">
         

          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-semibold">Cart Totals</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-primary">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-semibold">Total</span>
                <span className="font-display text-lg font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button size="lg" className="mt-4 w-full rounded-full" onClick={handleCheckout}>
              Proceed To Checkout
            </Button>
            {!session?.user && (
              <p className="mt-2 text-center text-xs text-muted">You&apos;ll need to log in to complete checkout.</p>
            )}
          </div>
        </div>

        {/* Product table */}
        <div className="order-last lg:order-first">
          {/* header row — desktop/tablet only */}
          <div className="hidden grid-cols-[1fr_100px_140px_100px_40px] gap-4 px-2 pb-3 text-xs font-semibold uppercase tracking-wide text-muted sm:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span />
          </div>

          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div key={item.productId} className="rounded-lg border border-border bg-surface p-3">
                {/* Desktop/tablet row */}
                <div className="hidden grid-cols-[1fr_100px_140px_100px_40px] items-center gap-4 sm:grid">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded-md object-cover bg-surface-2" />
                    <p className="truncate text-sm font-medium">{item.name}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">${item.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2 rounded-md border border-border w-fit">
                    <button onClick={() => decrement(item.productId)} className="flex h-8 w-8 items-center justify-center hover:bg-surface-2">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => increment(item.productId)} className="flex h-8 w-8 items-center justify-center hover:bg-surface-2">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-danger hover:bg-danger/10"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Mobile card */}
                <div className="flex items-center gap-3 sm:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded-md object-cover bg-surface-2" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-muted">${item.price.toFixed(2)} each</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-md border border-border">
                        <button onClick={() => decrement(item.productId)} className="flex h-7 w-7 items-center justify-center hover:bg-surface-2">
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => increment(item.productId)} className="flex h-7 w-7 items-center justify-center hover:bg-surface-2">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-danger hover:bg-danger/10"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link href="/shop">
              <Button variant="outline" className="rounded-full">
                Continue Shopping
              </Button>
            </Link>
            {/* Cart already updates instantly on every +/- click, so this is
                just a visual affordance matching the reference — there's no
                separate "apply changes" step to wire up. */}
            <Button variant="ghost" title="Cart totals already update automatically" disabled>
              <Tag size={14} className="mr-1" /> Cart is up to date
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}