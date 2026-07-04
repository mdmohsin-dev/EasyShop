import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { Category, Prisma } from "@prisma/client";

const PAGE_SIZE = 9;

// GET /api/products?page=1&category=Electronics&maxPrice=200&minRating=4&sort=featured&limit=3
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const category = searchParams.get("category") as Category | null;
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sort = searchParams.get("sort") ?? "featured";
  const limitParam = searchParams.get("limit");
  const pageSize = limitParam ? Math.min(50, Number(limitParam)) : PAGE_SIZE;

  const where: Prisma.ProductWhereInput = {};
  if (category && category !== ("All" as never)) where.category = category;
  if (maxPrice) where.price = { lte: Number(maxPrice) };
  if (minRating) where.rating = { gte: Number(minRating) };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "rating-desc"
      ? { rating: "desc" }
      : { featured: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      totalItems: total,
    },
  });
}

const createProductSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  price: z.number().positive(),
  image: z.string().url(),
  category: z.enum(["ELECTRONICS", "ACCESSORIES", "APPAREL"]),
});

// POST /api/products — admin only
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { ...parsed.data, rating: 5, featured: false },
  });

  return NextResponse.json({ product }, { status: 201 });
}
