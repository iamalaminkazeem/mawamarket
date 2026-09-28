"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/categories", label: "Categories" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/about", label: "About Page" },
  { href: "/admin/store", label: "Store Info" },
  { href: "/admin/hours", label: "Hours" },
  { href: "/admin/ordering", label: "Ordering" },
  { href: "/admin/settings", label: "Settings" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === l.href ? "bg-market-green text-white" : "hover:bg-white/10"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-2 text-sm text-market-cream/70 hover:text-market-cream mt-6"
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (pathname === "/admin/login") return null;

  return (
    <>
      <aside className="w-64 shrink-0 bg-market-charcoal text-market-cream min-h-screen p-6 hidden md:flex md:flex-col">
        <h1 className="font-serif text-xl font-bold text-market-gold mb-8">MaWa Market Admin</h1>
        <NavLinks pathname={pathname} />
        <SignOutButton />
      </aside>

      <div className="md:hidden sticky top-0 z-40 bg-market-charcoal text-market-cream flex items-center justify-between px-4 py-3">
        <h1 className="font-serif text-lg font-bold text-market-gold">MaWa Market Admin</h1>
        <button onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>

      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-market-charcoal text-market-cream p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-serif text-lg font-bold text-market-gold">Menu</h1>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            <SignOutButton />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </>
  );
}
