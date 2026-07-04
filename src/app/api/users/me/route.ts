import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user });
}

const updateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  image: z.string().url().optional(),
});

export async function PATCH(request: NextRequest) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session!.user.id },
    data: parsed.data,
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  return NextResponse.json({ user });
}
