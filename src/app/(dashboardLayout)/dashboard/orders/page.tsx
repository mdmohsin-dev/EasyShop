"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-surface-2 text-foreground/70",
  PAID: "bg-primary/10 text-primary",
  DELIVERED: "bg-primary text-primary-foreground",
  FAILED: "bg-danger/10 text-danger",
  CANCELLED: "bg-danger/10 text-danger",
};

interface OrderWithUser extends Order {
  user?: { name: string; email: string };
}

export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user.role === "ADMIN";

  useEffect(() => {
    if (isPending) return;
    const url = isAdmin ? "/api/orders?all=true" : "/api/orders";
    fetch(url)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, [isPending, isAdmin]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold sm:text-3xl">{isAdmin ? "All orders" : "My orders"}</h1>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">Order #{order.id.slice(-8)}</p>
                  {isAdmin && order.user && (
                    <p className="text-xs text-muted">{order.user.name} — {order.user.email}</p>
                  )}
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLES[order.status])}>
                  {order.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {order.items.map((item) => (
                  <span key={item.id} className="rounded-md bg-surface-2 px-2 py-1 text-xs">
                    {item.product.name} × {item.quantity}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-right font-display text-base font-semibold">${order.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
