"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, increment, decrement, removeFromCart, totalPrice } = useCart();

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Your cart</h1>

      <div className="mt-6 flex flex-col gap-3">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 shrink-0 rounded-md object-cover bg-surface-2"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.name}</p>
              <p className="text-sm text-muted">${item.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-2 rounded-md border border-border">
              <button
                onClick={() => decrement(item.productId)}
                className="flex h-8 w-8 items-center justify-center hover:bg-surface-2"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => increment(item.productId)}
                className="flex h-8 w-8 items-center justify-center hover:bg-surface-2"
              >
                <Plus size={14} />
              </button>
            </div>

            <p className="w-16 shrink-0 text-right text-sm font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(item.productId)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-danger hover:bg-danger/10"
              title="Remove"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4">
        <span className="font-medium">Total</span>
        <span className="font-display text-xl font-semibold">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
