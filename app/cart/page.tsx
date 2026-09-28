"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container-market py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-market-charcoal/20 mb-6" />
        <h1 className="section-heading mb-4">Your Cart is Empty</h1>
        <p className="text-market-charcoal/60 mb-8">Add some groceries to get started.</p>
        <Link href="/shop" className="btn-primary">Browse the Shop</Link>
      </div>
    );
  }

  return (
    <div className="container-market py-16 max-w-2xl mx-auto">
      <h1 className="section-heading mb-8 text-center">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {lines.map((l) => (
          <div key={l.lineId} className="flex gap-4 bg-white rounded-2xl border border-black/5 p-4 items-center">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-market-green/5">
              {l.imageUrl ? (
                <Image src={l.imageUrl} alt={l.name} fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[9px] text-market-charcoal/30 text-center">
                  No photo
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{l.name}</p>
              <p className="text-market-green font-semibold text-sm">${l.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(l.lineId, l.quantity - 1)}
                className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center hover:bg-market-cream"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium">{l.quantity}</span>
              <button
                onClick={() => updateQuantity(l.lineId, l.quantity + 1)}
                className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center hover:bg-market-cream"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => removeLine(l.lineId)}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label={`Remove ${l.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-5 mb-8">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span className="text-market-green">${subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-market-charcoal/50 mt-1">
          Delivery fee and tax (if applicable) calculated at checkout.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/shop" className="btn-secondary flex-1 text-center">
          Continue Shopping
        </Link>
        <Link href="/checkout" className="btn-primary flex-1 text-center">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
