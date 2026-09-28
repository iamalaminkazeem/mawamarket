import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, categoryCount, newOrderCount, customerCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: "RECEIVED" } }),
    prisma.customer.count(),
  ]);

  const cards = [
    { label: "New Orders", value: newOrderCount, href: "/admin/orders" },
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Categories", value: categoryCount, href: "/admin/products/categories" },
    { label: "Registered Customers", value: customerCount, href: "/admin/orders" },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 hover:shadow-md transition-shadow"
          >
            <p className="text-3xl font-bold text-market-green">{c.value}</p>
            <p className="text-sm text-market-charcoal/60 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl p-6 border border-black/5">
        <h2 className="font-semibold mb-3">Quick Tips</h2>
        <ul className="text-sm text-market-charcoal/70 space-y-1.5 list-disc list-inside">
          <li>Check the Orders tab regularly — new orders appear there in real time.</li>
          <li>Products imported from the Clover export with no fixed price are hidden until you set a real price in Products.</li>
          <li>Mark your best sellers as "Featured" so they appear on the homepage.</li>
          <li>Customers can create accounts to track their own order history and save their cart across visits.</li>
        </ul>
      </div>
    </div>
  );
}
