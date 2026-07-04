import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const userId = session!.user.id;

  const [purchasedItems, pendingOrders] = await Promise.all([
    prisma.orderItem.aggregate({
      where: { order: { userId, status: { in: ["PAID", "DELIVERED"] } } },
      _sum: { quantity: true },
    }),
    prisma.order.count({ where: { userId, status: "PENDING" } }),
  ]);

  return NextResponse.json({
    totalPurchased: purchasedItems._sum.quantity ?? 0,
    pendingOrders,
  });
}
