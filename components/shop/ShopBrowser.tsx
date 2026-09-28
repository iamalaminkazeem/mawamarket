"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Plus, Check } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { useSearchParams } from "next/navigation";

export default function ShopBrowser({
  categories,
  orderingEnabled,
}: {
  categories: any[];
  orderingEnabled: boolean;
}) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category");
  const initialCatId = initialCat ? categories.find((c) => c.slug === initialCat)?.id : null;

  const [active, setActive] = useState<string>(initialCatId || "all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return categories
      .filter((c) => active === "all" || c.id === active)
      .map((c) => ({
        ...c,
        products: c.products.filter((p: any) => {
          if (!query.trim()) return true;
          const q = query.toLowerCase();
          return p.name.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
        }),
      }))
      .filter((c) => c.products.length > 0);
  }, [categories, active, query]);

  if (categories.length === 0) {
    return (
      <p className="text-center text-market-charcoal/50 py-20">
        Products coming soon — check back shortly!
      </p>
    );
  }

  return (
    <div>
      <div className="relative max-w-md mx-auto mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-market-charcoal/40" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-full border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-market-gold"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 mb-10">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
            active === "all" ? "bg-market-green text-market-cream border-market-green" : "border-black/10 hover:border-market-green"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
              active === c.id ? "bg-market-green text-market-cream border-market-green" : "border-black/10 hover:border-market-green"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="space-y-14">
        {filtered.map((c) => (
          <div key={c.id}>
            <h2 className="font-serif text-2xl font-semibold mb-6 text-market-green">{c.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {c.products.map((p: any) => (
                <ProductCard key={p.id} product={p} orderingEnabled={orderingEnabled} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-market-charcoal/50 py-10">No products match your search.</p>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, orderingEnabled }: { product: any; orderingEnabled: boolean }) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addLine({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-black/5 bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-28 sm:h-36 bg-market-green/5">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[10px] text-market-charcoal/30 text-center px-2">
            No photo
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-1 min-h-[2.5em]">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-market-green font-semibold text-sm">${product.price.toFixed(2)}</span>
          {orderingEnabled && (
            <button
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={`rounded-full p-2 transition-all duration-300 ${
                added ? "bg-market-gold text-market-charcoal scale-110" : "bg-market-green text-market-cream hover:scale-110"
              }`}
            >
              {added ? <Check size={16} /> : <Plus size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
