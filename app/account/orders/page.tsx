import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrderHistoryPage() {
  const session = await getServerSession(authOptions);
  const customerId = (session?.user as any)?.id;

  const orders = customerId
    ? await prisma.order.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      })
    : [];

  return (
    <div className="container-market py-16 max-w-2xl mx-auto">
      <h1 className="section-heading mb-8 text-center">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-market-charcoal/60 mb-6">You haven't placed any orders yet.</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/order-confirmation/${o.orderNumber}`}
              className="block bg-white rounded-2xl border border-black/5 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="text-xs text-market-charcoal/50">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${statusColors[o.status]}`}>
                  {o.status.toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-market-charcoal/60 capitalize">{o.orderType.toLowerCase()}</span>
                <span className="text-market-green font-semibold">${o.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
