"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminStats {
  weeklyPaymentChart: { label: string; count: number }[];
}

export default function PaymentsChart() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  // Change TICK_STEP to 2, 3, or whatever gap you want between Y-axis
  // labels. Change MIN_Y_AXIS_MAX to 6, 8, or whatever you want the axis to
  // reach at minimum — the axis still grows past this automatically if the
  // real data exceeds it, so it's a floor, not a hard cap.
  const TICK_STEP = 2;
  const MIN_Y_AXIS_MAX = 8;
  const chartMax = Math.max(0, ...(stats?.weeklyPaymentChart?.map((d) => d.count) ?? [0]));
  const dataBasedMax = Math.ceil((chartMax + 1) / TICK_STEP) * TICK_STEP;
  const yAxisMax = Math.max(dataBasedMax, MIN_Y_AXIS_MAX);
  const yTicks = Array.from({ length: yAxisMax / TICK_STEP + 1 }, (_, i) => i * TICK_STEP);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Successful product payments (last 15 days)</CardTitle>
      </CardHeader>
      <CardContent className="h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats?.weeklyPaymentChart ?? []}>
            <defs>
              <linearGradient id="paymentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="var(--muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              allowDecimals={false}
              ticks={yTicks}
              domain={[0, yAxisMax]}
            />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }} />
            <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} fill="url(#paymentGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}