"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Desktop: top nav. Mobile: slim top bar with just the logo (navigation lives in <BottomNav />).
export default function Navigation({ settings }: { settings: any }) {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { data: session } = useSession();
  const isCustomer = (session?.user as any)?.role === "customer";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-market-cream/95 backdrop-blur shadow-md" : "bg-market-cream/80 backdrop-blur"
      }`}
    >
      <div className="container-market flex items-center justify-center lg:justify-between h-14 lg:h-20">
        <Link href="/" className="font-serif text-2xl font-bold text-market-green">
          {settings.storeName || "MaWa Market"}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium tracking-wide hover:text-market-green transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={isCustomer ? "/account" : "/account/login"}
            className="p-2 hover:text-market-green transition-colors"
            aria-label={isCustomer ? "My Account" : "Log In"}
          >
            <User size={22} />
          </Link>
          <Link href="/cart" className="relative p-2 hover:text-market-green transition-colors" aria-label="Cart">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-market-gold text-market-charcoal text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/shop" className="btn-primary !py-2 !px-4 text-sm">
            {settings.orderButtonText || "Shop Now"}
          </Link>
        </div>
      </div>
    </header>
  );
}