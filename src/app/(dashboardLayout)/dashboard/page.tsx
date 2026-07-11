import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import CustomerDashboard from "@/components/Dashboard/CustomerDashboard";

export default async function DashboardPage() {
  
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return session.user.role === "ADMIN" ? <AdminDashboard /> : <CustomerDashboard />;
}