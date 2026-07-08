"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
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
            <LineChart data={stats?.weeklyProductChart ?? []}>
              <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1e3a5f"
                strokeDasharray="1 5"
                vertical
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                stroke="#6b7280"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#6b7280"
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #374151",
                  borderRadius: 10,
                }}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="none"
                fill="url(#fillGradient)"
              />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#60A5FA"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#60A5FA",
                  stroke: "#93C5FD",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
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
