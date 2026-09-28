import { prisma } from "@/lib/db/prisma";
import { getSettings } from "@/lib/utils/settings";
import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { notFound } from "next/navigation";

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: { items: true },
    }),
    getSettings(),
  ]);

  if (!order) return notFound();

  return (
    <div className="container-market py-16 max-w-xl mx-auto text-center">
      <CheckCircle2 size={48} className="mx-auto text-market-green mb-6" />
      <h1 className="section-heading mb-2">Order Received</h1>
      <p className="text-market-gold font-semibold text-lg mb-4">{order.orderNumber}</p>
      <p className="text-market-charcoal/70 mb-8">
        Thank you for shopping with {settings.storeName}. {settings.orderReceivedNote}
      </p>

      <div className="bg-white rounded-2xl border border-black/5 p-6 text-left mb-8">
        <div className="divide-y divide-black/5">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 text-sm flex justify-between">
              <span>{item.quantity}× {item.itemNameSnapshot}</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-black/5 pt-3 mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-market-charcoal/60">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between">
              <span className="text-market-charcoal/60">Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          {order.tax > 0 && (
            <div className="flex justify-between">
              <span className="text-market-charcoal/60">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base pt-1">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {settings.phone && (
          <a href={`tel:${settings.phone}`} className="btn-secondary">
            <Phone size={16} /> Call Us
          </a>
        )}
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  );
}
