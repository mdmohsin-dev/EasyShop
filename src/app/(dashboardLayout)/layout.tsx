import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  // Role/auth checks belong on the server, not just in the UI — a client-only
  // check can be bypassed by hitting the page directly or disabling JS, and
  // it does nothing to protect the underlying API routes anyway. Every
  // dashboard route (and every /api/* route it calls) re-checks the session
  // itself, so this is defense in depth, not the only line of defense.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}