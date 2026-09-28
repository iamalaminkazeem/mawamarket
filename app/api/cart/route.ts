import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const putSchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(0).max(99),
      })
    )
    .max(200),
});

async function getCustomerId() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  return user?.id && user?.role === "customer" ? (user.id as string) : null;
}

export async function GET() {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only return items that can actually be ordered right now.
  const items = await prisma.cartItem.findMany({
    where: { customerId, product: { available: true, priceVaries: false } },
    include: { product: true },
  });

  return NextResponse.json(
    items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      price: i.product.price,
      imageUrl: i.product.imageUrl,
      quantity: i.quantity,
    }))
  );
}

export async function PUT(req: NextRequest) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Merge duplicate product lines (the table has one row per customer+product).
  const merged = new Map<string, number>();
  for (const l of parsed.data.lines) {
    if (l.quantity > 0) merged.set(l.productId, Math.min(99, (merged.get(l.productId) || 0) + l.quantity));
  }

  // Drop products that no longer exist so a stale cart can never break syncing.
  const existing = await prisma.product.findMany({
    where: { id: { in: Array.from(merged.keys()) } },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((p) => p.id));

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { customerId } }),
    prisma.cartItem.createMany({
      data: Array.from(merged.entries())
        .filter(([productId]) => existingIds.has(productId))
        .map(([productId, quantity]) => ({ customerId, productId, quantity })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
