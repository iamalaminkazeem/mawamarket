import { prisma } from "@/lib/db/prisma";
import ShopBrowser from "@/components/shop/ShopBrowser";
import { getSettings } from "@/lib/utils/settings";
import { Suspense } from "react";

export const revalidate = 60;

export default async function ShopPage() {
  const settings = await getSettings();

  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { available: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    categories = categories.filter((c) => c.products.length > 0);
  } catch {
    categories = [];
  }

  return (
    <div className="container-market py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="uppercase tracking-[0.2em] text-market-gold text-xs font-semibold mb-4">
          {settings.storeName}
        </p>
        <h1 className="section-heading mb-4">Shop Our Groceries</h1>
        <p className="text-market-charcoal/70">
          Fresh produce, pantry staples, and specialty ingredients from home.
        </p>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-market-charcoal/40">Loading products...</div>}>
        <ShopBrowser categories={categories} orderingEnabled={settings.orderingEnabled} />
      </Suspense>
    </div>
  );
}
