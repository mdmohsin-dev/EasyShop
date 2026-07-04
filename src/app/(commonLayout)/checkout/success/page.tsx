"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 size={28} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-semibold">Payment successful</h1>
      <p className="mt-2 text-sm text-muted">
        {orderId ? `Order #${orderId.slice(-8)} has been placed.` : "Your order has been placed."}
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/dashboard/orders">
          <Button variant="outline">View my orders</Button>
        </Link>
        <Link href="/shop">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-muted">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
