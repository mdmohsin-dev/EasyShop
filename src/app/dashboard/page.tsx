"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, Plus } from "lucide-react";

function getLast7DaysCounts(dates: string[]) {
  const days: { label: string; count: number }[] = [];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = dates.filter((iso) => {
      const t = new Date(iso).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    days.push({ label: dayLabels[d.getDay()], count });
  }
  return days;
}

function AdminDashboard() {
  const { users } = useAuth();
  const { products } = useProducts();

  const chartData = useMemo(
    () => getLast7DaysCounts(products.map((p) => p.createdAt)),
    [products]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted">An overview of the shop.</p>
        </div>
        <Link href="/dashboard/add-product">
          <Button variant="accent">
            <Plus size={16} /> Add product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Users size={20} />
            </span>
            <div>
              <p className="text-2xl font-semibold font-display">{users.length}</p>
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
              <p className="text-2xl font-semibold font-display">{products.length}</p>
              <p className="text-sm text-muted">Products listed</p>
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerDashboard() {
  const { user } = useAuth();
  const { cart, totalItems, totalPrice } = useCart();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-muted">Here&apos;s a quick look at your cart.</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-2xl font-semibold font-display">{totalItems}</p>
            <p className="text-sm text-muted">Items in cart</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-2xl font-semibold font-display">${totalPrice.toFixed(2)}</p>
            <p className="text-sm text-muted">Cart total</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/cart">
          <Button variant="outline">Go to cart</Button>
        </Link>
      </div>

      {cart.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          Your cart is empty right now.{" "}
          <Link href="/" className="text-primary hover:underline">
            Browse the shop
          </Link>
          .
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {user?.role === "admin" ? <AdminDashboard /> : <CustomerDashboard />}
    </ProtectedRoute>
  );
}
