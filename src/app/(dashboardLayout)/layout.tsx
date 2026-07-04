import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar user={session.user} />
      <div className="flex flex-1">
        <DashboardSidebar user={session.user} />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}