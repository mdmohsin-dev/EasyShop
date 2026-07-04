import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getSslClient } from "@/lib/sslcommerz";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const initSchema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const parsed = initSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order || order.userId !== session!.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "PENDING") {
    return NextResponse.json({ error: "This order isn't awaiting payment" }, { status: 400 });
  }

  // tran_id must be unique per attempt — SSLCommerz will call our
  // success/fail/cancel routes back with this same value.
  const tran_id = `${order.id}-${Date.now()}`;

  const data = {
    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id,
    success_url: `${APP_URL}/api/payment/success`,
    fail_url: `${APP_URL}/api/payment/fail`,
    cancel_url: `${APP_URL}/api/payment/cancel`,
    shipping_method: "Courier",
    product_name: `Order ${order.id}`,
    product_category: "General",
    product_profile: "general",
    cus_name: session!.user.name,
    cus_email: session!.user.email,
    cus_add1: "N/A",
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "N/A",
    ship_name: session!.user.name,
    ship_add1: "N/A",
    ship_city: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  };

  await prisma.order.update({ where: { id: order.id }, data: { transactionId: tran_id } });

  const apiResponse = await getSslClient().init(data);

  if (!apiResponse?.GatewayPageURL) {
    return NextResponse.json({ error: "Could not start payment session" }, { status: 502 });
  }

  return NextResponse.json({ gatewayUrl: apiResponse.GatewayPageURL });
}
