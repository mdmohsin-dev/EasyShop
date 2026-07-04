import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

// GET /api/orders — the logged-in user's own orders, newest first
// Admins can pass ?all=true to see every order (used by /dashboard/orders)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const wantsAll = new URL(request.url).searchParams.get("all") === "true";
  const isAdmin = session!.user.role === "ADMIN";

  const orders = await prisma.order.findMany({
    where: wantsAll && isAdmin ? {} : { userId: session!.user.id },
    include: { items: { include: { product: true } }, user: wantsAll && isAdmin },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

// POST /api/orders — turns the logged-in user's current cart into a PENDING order.
// This does NOT charge anything — /api/payment/init is what starts the actual
// SSLCommerz payment for the order this returns.
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session!.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const totalAmount = cartItems.reduce(
    (sum: number, item: (typeof cartItems)[number]) => sum + item.product.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: session!.user.id,
      totalAmount,
      status: "PENDING",
      items: {
        create: cartItems.map((item: (typeof cartItems)[number]) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price, // snapshot the price at order time
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ order }, { status: 201 });
}
