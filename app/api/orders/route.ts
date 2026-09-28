import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { nextOrderNumber } from "@/lib/utils/orderNumber";
import { getSettings } from "@/lib/utils/settings";
import { z } from "zod";

// NOTE: money values (prices, subtotal, fees, tax, total) are intentionally NOT accepted
// from the client. They are always recomputed here from the database so an order can never
// be placed at a tampered price.
const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  specialInstructions: z.string().max(300).optional().nullable(),
});

const orderSchema = z.object({
  customerName: z.string().min(1).max(120),
  customerPhone: z.string().min(1).max(40),
  customerEmail: z.string().email().optional().nullable(),
  orderType: z.enum(["PICKUP", "DELIVERY"]),
  deliveryAddress: z.string().max(200).optional().nullable(),
  deliveryCity: z.string().max(100).optional().nullable(),
  deliveryState: z.string().max(50).optional().nullable(),
  deliveryZip: z.string().max(20).optional().nullable(),
  deliveryInstructions: z.string().max(300).optional().nullable(),
  specialInstructions: z.string().max(300).optional().nullable(),
  items: z.array(orderItemSchema).min(1).max(100),
});

const round2 = (n: number) => Math.round(n * 100) / 100;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const settings = await getSettings();

  if (!settings.orderingEnabled) {
    return NextResponse.json({ error: "Online ordering is currently paused." }, { status: 403 });
  }

  if (data.orderType === "DELIVERY") {
    if (!settings.deliveryEnabled) {
      return NextResponse.json({ error: "Delivery is not currently available." }, { status: 400 });
    }
    if (!data.deliveryAddress?.trim() || !data.deliveryCity?.trim() || !data.deliveryZip?.trim()) {
      return NextResponse.json({ error: "A full delivery address is required." }, { status: 400 });
    }
  }

  // Load the real products from the database — merge duplicate lines for the same product.
  const productIds = Array.from(new Set(data.items.map((i) => i.productId)));
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions: string | null;
  }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product || !product.available || product.priceVaries) {
      return NextResponse.json(
        { error: `"${product?.name ?? "An item in your cart"}" is no longer available. Please review your cart.` },
        { status: 409 }
      );
    }
    lineItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions || null,
    });
  }

  const subtotal = round2(lineItems.reduce((sum, l) => sum + l.price * l.quantity, 0));

  if (data.orderType === "DELIVERY" && settings.deliveryMinimum != null && subtotal < settings.deliveryMinimum) {
    return NextResponse.json(
      { error: `Minimum order for delivery is $${settings.deliveryMinimum.toFixed(2)}.` },
      { status: 400 }
    );
  }

  const deliveryFee =
    data.orderType === "DELIVERY" && settings.deliveryEnabled && settings.deliveryFee != null
      ? settings.deliveryFee
      : 0;

  const tax = !settings.taxEnabled
    ? 0
    : settings.taxMode === "flat"
    ? settings.taxFlatAmount ?? 0
    : settings.taxRate
    ? round2(subtotal * settings.taxRate)
    : 0;

  const total = round2(subtotal + deliveryFee + tax);

  // Always derive the customer link from the server-side session — never trust a
  // client-supplied customerId, which would let anyone attach orders to any account.
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as any;
  const customerId = sessionUser?.role === "customer" ? sessionUser.id : null;

  const orderNumber = await nextOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      orderType: data.orderType,
      deliveryAddress: data.orderType === "DELIVERY" ? data.deliveryAddress : null,
      deliveryCity: data.orderType === "DELIVERY" ? data.deliveryCity : null,
      deliveryState: data.orderType === "DELIVERY" ? data.deliveryState : null,
      deliveryZip: data.orderType === "DELIVERY" ? data.deliveryZip : null,
      deliveryInstructions: data.orderType === "DELIVERY" ? data.deliveryInstructions : null,
      specialInstructions: data.specialInstructions,
      subtotal,
      deliveryFee,
      tax,
      total,
      items: {
        create: lineItems.map((l) => ({
          productId: l.productId,
          itemNameSnapshot: l.name,
          priceSnapshot: l.price,
          quantity: l.quantity,
          subtotal: round2(l.price * l.quantity),
          specialInstructions: l.specialInstructions,
        })),
      },
    },
  });

  // Clear the customer's persisted server cart now that it's become an order.
  if (customerId) {
    await prisma.cartItem.deleteMany({ where: { customerId } });
  }

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
}
