import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

const CHART_DAYS = 15;

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - (CHART_DAYS - 1));
  rangeStart.setHours(0, 0, 0, 0);

  const [totalUsers, totalProducts, pendingOrders, paidOrderItems] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    // "successful product payments" — order items belonging to orders whose
    // payment actually succeeded (status PAID), updated within the last
    // CHART_DAYS days. updatedAt is used as the "paid on" date since that's
    // the moment /api/payment/success flips the order's status to PAID.
    prisma.orderItem.findMany({
      where: {
        order: { status: "PAID", updatedAt: { gte: rangeStart } },
      },
      select: { quantity: true, order: { select: { updatedAt: true } } },
    }),
  ]);

  // bucket the last CHART_DAYS days for the chart. A weekday name (Mon, Tue…)
  // would repeat once you go past 7 days, so use a short date label instead
  // (e.g. "Jul 10") to keep every point on the X-axis unambiguous.
  const chartData = Array.from({ length: CHART_DAYS }).map((_, i) => {
    const day = new Date(rangeStart);
    day.setDate(rangeStart.getDate() + i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);

    const count = paidOrderItems
      .filter((item: (typeof paidOrderItems)[number]) => item.order.updatedAt >= day && item.order.updatedAt < next)
      .reduce((sum: number, item: (typeof paidOrderItems)[number]) => sum + item.quantity, 0);

    const label = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { label, count };
  });

  return NextResponse.json({
    totalUsers,
    totalProducts,
    pendingOrders,
    weeklyPaymentChart: chartData,
  });
}