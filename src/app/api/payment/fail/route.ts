import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tran_id = formData.get("tran_id")?.toString();

  if (tran_id) {
    const order = await prisma.order.findUnique({ where: { transactionId: tran_id } });
    if (order) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
      return NextResponse.redirect(`${APP_URL}/checkout/fail?order=${order.id}`);
    }
  }

  return NextResponse.redirect(`${APP_URL}/checkout/fail`);
}
