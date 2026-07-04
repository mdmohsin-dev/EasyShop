import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSslClient } from "@/lib/sslcommerz";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// SSLCommerz's server POSTs here directly (not the user's browser), so there
// is no session cookie to check — the order is identified by tran_id, and we
// re-validate the payment with SSLCommerz itself before trusting it.
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tran_id = formData.get("tran_id")?.toString();
  const val_id = formData.get("val_id")?.toString();

  if (!tran_id || !val_id) {
    return NextResponse.redirect(`${APP_URL}/checkout/fail`);
  }

  const order = await prisma.order.findUnique({ where: { transactionId: tran_id } });
  if (!order) {
    return NextResponse.redirect(`${APP_URL}/checkout/fail`);
  }

  const validation = await getSslClient().validate({ val_id });
  const isValid =
    validation?.status === "VALID" || validation?.status === "VALIDATED";

  if (!isValid || Number(validation.amount) < order.totalAmount) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return NextResponse.redirect(`${APP_URL}/checkout/fail?order=${order.id}`);
  }

  const orderItems = await prisma.orderItem.findMany({ where: { orderId: order.id } });
  const productIds = orderItems.map((i: (typeof orderItems)[number]) => i.productId);

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
    // payment succeeded — the items that were just ordered can now come out of the cart
    prisma.cartItem.deleteMany({
      where: { userId: order.userId, productId: { in: productIds } },
    }),
  ]);

  return NextResponse.redirect(`${APP_URL}/checkout/success?order=${order.id}`);
}
