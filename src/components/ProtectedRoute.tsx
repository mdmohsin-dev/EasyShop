"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/types";

export default function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allow && !allow.includes(user.role)) {
      router.replace("/");
    }
  }, [user, loading, allow, router]);

  if (loading || !user || (allow && !allow.includes(user.role))) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}
