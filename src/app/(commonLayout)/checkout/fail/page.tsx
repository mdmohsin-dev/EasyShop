"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function FailContent() {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "true";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <XCircle size={28} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-semibold">
        {cancelled ? "Payment cancelled" : "Payment failed"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {cancelled ? "You cancelled the payment before it completed." : "Something went wrong processing your payment. You haven't been charged."}
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/cart">
          <Button variant="outline">Back to cart</Button>
        </Link>
        <Link href="/checkout">
          <Button>Try again</Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-muted">Loading…</div>}>
      <FailContent />
    </Suspense>
  );
}
