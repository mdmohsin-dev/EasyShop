import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

// GET /api/cart — logged-in user's cart, with product details
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const cart = await prisma.cartItem.findMany({
    where: { userId: session!.user.id },
    include: { product: true },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ cart });
}

const addSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

// POST /api/cart — add a product (or bump quantity if it's already in the cart)
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session!.user.id, productId } },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      })
    : await prisma.cartItem.create({
        data: { userId: session!.user.id, productId, quantity },
        include: { product: true },
      });

  return NextResponse.json({ item }, { status: 201 });
}

const updateSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0), // 0 = remove
});

// PATCH /api/cart — set an exact quantity (0 removes the item)
export async function PATCH(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { productId, quantity } = parsed.data;

  if (quantity === 0) {
    await prisma.cartItem.deleteMany({ where: { userId: session!.user.id, productId } });
    return NextResponse.json({ success: true });
  }

  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId: session!.user.id, productId } },
    data: { quantity },
    include: { product: true },
  });
  return NextResponse.json({ item });
}

// DELETE /api/cart?productId=... — remove one line item
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const productId = new URL(request.url).searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  await prisma.cartItem.deleteMany({ where: { userId: session!.user.id, productId } });
  return NextResponse.json({ success: true });
}
