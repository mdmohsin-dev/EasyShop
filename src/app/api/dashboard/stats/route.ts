import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const [totalUsers, totalProducts, recentProducts, pendingOrders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  
  const chartData = Array.from({ length: 14 }).map((_, i) => {
    const day = new Date(fourteenDaysAgo);
    day.setDate(fourteenDaysAgo.getDate() + i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = recentProducts.filter(
      (p: { createdAt: Date }) => p.createdAt >= day && p.createdAt < next
    ).length;
    return {  label: day.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  count};
  });

  return NextResponse.json({
    totalUsers,
    totalProducts,
    pendingOrders,
    weeklyProductChart: chartData,
  });
}
