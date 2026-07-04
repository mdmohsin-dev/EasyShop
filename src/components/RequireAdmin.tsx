"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isPending, session, router]);

  if (isPending || session?.user.role !== "ADMIN") {
    return <p className="p-8 text-sm text-muted">Loading…</p>;
  }

  return <>{children}</>;
}
