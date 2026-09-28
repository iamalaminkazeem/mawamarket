import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Package, LogOut, User } from "lucide-react";
import SignOutButton from "@/components/account/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const customer = session?.user
    ? await prisma.customer.findUnique({ where: { id: (session.user as any).id } })
    : null;

  const recentOrders = customer
    ? await prisma.order.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  return (
    <div className="container-market py-16 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-market-green/10 flex items-center justify-center">
          <User size={22} className="text-market-green" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold">Hi, {customer?.name}</h1>
          <p className="text-sm text-market-charcoal/60">{customer?.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/account/orders"
          className="bg-white rounded-2xl border border-black/5 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <Package size={24} className="text-market-gold" />
          <div>
            <p className="font-medium">Order History</p>
            <p className="text-xs text-market-charcoal/50">View all your past orders</p>
          </div>
        </Link>
        <Link
          href="/shop"
          className="bg-white rounded-2xl border border-black/5 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-6 h-6 rounded-full bg-market-green/10 flex items-center justify-center shrink-0">
            <span className="text-market-green text-xs">→</span>
          </div>
          <div>
            <p className="font-medium">Continue Shopping</p>
            <p className="text-xs text-market-charcoal/50">Browse the full catalog</p>
          </div>
        </Link>
      </div>

      {recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-8">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/order-confirmation/${o.orderNumber}`}
                className="flex justify-between items-center text-sm py-2 border-b border-black/5 last:border-0"
              >
                <span className="font-medium">{o.orderNumber}</span>
                <span className="text-market-charcoal/50">{new Date(o.createdAt).toLocaleDateString()}</span>
                <span className="text-market-green font-semibold">${o.total.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <SignOutButton />
    </div>
  );
}
