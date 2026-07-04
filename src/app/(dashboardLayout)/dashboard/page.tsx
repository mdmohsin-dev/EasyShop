"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, Plus, ShoppingBag, Clock } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  weeklyProductChart: { label: string; count: number }[];
}

interface CustomerStats {
  totalPurchased: number;
  pendingOrders: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted">An overview of the shop.</p>
        </div>
        <Link href="/dashboard/add">
          <Button variant="accent">
            <Plus size={16} /> Add product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Users size={20} />
            </span>
            <div>
              <p className="text-2xl font-semibold font-display">{stats?.totalUsers ?? "—"}</p>
              <p className="text-sm text-muted">Registered users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Package size={20} />
            </span>
            <div>
              <p className="text-2xl font-semibold font-display">{stats?.totalProducts ?? "—"}</p>
              <p className="text-sm text-muted">Products listed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-danger text-danger-foreground">
              <Clock size={20} />
            </span>
            <div>
              <p className="text-2xl font-semibold font-display">{stats?.pendingOrders ?? "—"}</p>
              <p className="text-sm text-muted">Pending orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Products created this week</CardTitle>
        </CardHeader>
        <CardContent className="h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.weeklyProductChart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<CustomerStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/customer-stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Welcome, {session?.user.name}</h1>
      <p className="mt-1 text-sm text-muted">Here&apos;s a quick look at your account.</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShoppingBag size={20} />
            </span>
            <div>
              <p className="text-2xl font-semibold font-display">{stats?.totalPurchased ?? "—"}</p>
              <p className="text-sm text-muted">Products purchased</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Clock size={20} />
            </span>
            <div>
              <p className="text-2xl font-semibold font-display">{stats?.pendingOrders ?? "—"}</p>
              <p className="text-sm text-muted">Pending orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/dashboard/orders">
          <Button variant="outline">View my orders</Button>
        </Link>
        <Link href="/shop">
          <Button>Browse the shop</Button>
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <p className="p-8 text-sm text-muted">Loading…</p>;
  }

  return session?.user.role === "ADMIN" ? <AdminDashboard /> : <CustomerDashboard />;
}
