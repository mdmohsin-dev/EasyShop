import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const mergeSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),
});

// POST /api/cart/merge — called once, right after a successful login,
// with whatever was sitting in the guest's localStorage cart.
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const parsed = mergeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userId = session!.user.id;

  await prisma.$transaction(
    parsed.data.items.map((item) =>
      prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId: item.productId } },
        update: { quantity: { increment: item.quantity } },
        create: { userId, productId: item.productId, quantity: item.quantity },
      })
    )
  );

  const cart = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  return NextResponse.json({ cart });
}
