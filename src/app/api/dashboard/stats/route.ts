import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [totalUsers, totalProducts, recentProducts, pendingOrders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  // bucket the last 7 days into day labels for the bar chart
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(sevenDaysAgo);
    day.setDate(sevenDaysAgo.getDate() + i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = recentProducts.filter(
      (p: { createdAt: Date }) => p.createdAt >= day && p.createdAt < next
    ).length;
    return { label: dayLabels[day.getDay()], count };
  });

  return NextResponse.json({
    totalUsers,
    totalProducts,
    pendingOrders,
    weeklyProductChart: chartData,
  });
}
