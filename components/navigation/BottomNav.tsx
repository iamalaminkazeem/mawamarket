"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Store, ShoppingCart, User, Menu, X, Info, Phone } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { data: session } = useSession();
  const isCustomer = (session?.user as any)?.role === "customer";
  const [moreOpen, setMoreOpen] = useState(false);

  // Close the "More" sheet whenever the route changes
  useEffect(() => setMoreOpen(false), [pathname]);

  // Hidden in admin and on checkout (keeps the checkout button uncovered)
  if (pathname.startsWith("/admin") || pathname === "/checkout") return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const accountHref = isCustomer ? "/account" : "/account/login";

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: Store },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: itemCount },
    { href: accountHref, label: isCustomer ? "Account" : "Log In", icon: User, match: "/account" },
  ];

  const tabClass = (active: boolean) =>
    `relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
      active ? "text-market-green" : "text-market-charcoal/60"
    }`;

  return (
    <>
      {/* "More" sheet */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMoreOpen(false)}
            aria-label="Close menu"
          />
          <div
            className="absolute inset-x-0 bottom-0 bg-market-cream rounded-t-2xl px-5 pt-4 shadow-2xl animate-fadeUp"
            style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-lg font-bold text-market-green">More</span>
              <button onClick={() => setMoreOpen(false)} className="p-2" aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <Link href="/about" className="flex items-center gap-3 py-3.5 border-b border-black/5 font-medium">
              <Info size={20} className="text-market-green" /> About
            </Link>
            <Link href="/contact" className="flex items-center gap-3 py-3.5 font-medium">
              <Phone size={20} className="text-market-green" /> Contact
            </Link>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-[60] bg-market-cream/95 backdrop-blur border-t border-market-gold/30 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Main navigation"
      >
        <div className="flex h-16">
          {tabs.map(({ href, label, icon: Icon, badge, match }) => {
            const active = isActive(match || href);
            return (
              <Link key={label} href={href} className={tabClass(active)} aria-current={active ? "page" : undefined}>
                <span className="relative">
                  <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                  {!!badge && badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-market-gold text-market-charcoal text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={tabClass(moreOpen || isActive("/about") || isActive("/contact"))}
            aria-label="More"
          >
            <Menu size={22} strokeWidth={1.8} />
            More
          </button>
        </div>
      </nav>

      {/* Spacer so the footer isn't hidden behind the bar */}
      <div className="lg:hidden" style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }} aria-hidden />
    </>
  );
}