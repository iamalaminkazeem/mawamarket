"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

export default function FloatingCartButton() {
  const { itemCount, subtotal } = useCart();
  const pathname = usePathname();

  // Hide on pages where it would cover primary actions (or is redundant).
  const hiddenOn = ["/cart", "/checkout"];
  if (itemCount === 0 || hiddenOn.includes(pathname) || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed left-0 right-0 z-40 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] lg:bottom-6 flex justify-center pointer-events-none">
      <div className="animate-fadeUp pointer-events-auto">
        <Link
          href="/cart"
          className="flex items-center gap-3 bg-market-green text-market-cream rounded-full pl-4 pr-5 py-3 shadow-xl transition-transform duration-300 hover:scale-105"
        >
          <ShoppingCart size={20} />
          <span className="font-medium text-sm">
            {itemCount} item{itemCount !== 1 ? "s" : ""} · ${subtotal.toFixed(2)}
          </span>
        </Link>
      </div>
    </div>
  );
}