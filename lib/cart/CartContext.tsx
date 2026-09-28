"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";

export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  specialInstructions?: string;
};

type CartContextValue = {
  lines: CartLine[];
  subtotal: number;
  itemCount: number;
  addLine: (line: Omit<CartLine, "lineId">) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mawa-market-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { data: session, status } = useSession();
  const isCustomer = status === "authenticated" && (session?.user as any)?.role === "customer";
  const mergedForSession = useRef(false);
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Load from localStorage on first mount (guest cart, or pre-merge cache)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(JSON.parse(stored));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // 2. Always mirror to localStorage (acts as an offline fallback even when logged in)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full or unavailable — cart just won't persist locally
    }
  }, [lines, hydrated]);

  // 3. On login: merge whatever guest cart is in localStorage with the customer's saved
  //    server cart (sum quantities for shared products), then push the merged result back.
  useEffect(() => {
    if (!hydrated || !isCustomer || mergedForSession.current) return;
    mergedForSession.current = true;

    (async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) return;
        const serverLines: Array<{ productId: string; name: string; price: number; imageUrl: string | null; quantity: number }> =
          await res.json();

        setLines((localLines) => {
          const merged: CartLine[] = [];
          const seen = new Set<string>();

          for (const sl of serverLines) {
            const localMatch = localLines.find((l) => l.productId === sl.productId);
            merged.push({
              lineId: `${sl.productId}-server`,
              productId: sl.productId,
              name: sl.name,
              price: sl.price,
              imageUrl: sl.imageUrl,
              quantity: sl.quantity + (localMatch?.quantity || 0),
            });
            seen.add(sl.productId);
          }
          for (const ll of localLines) {
            if (!seen.has(ll.productId)) merged.push(ll);
          }
          return merged;
        });
      } catch {
        // server cart unreachable — keep local cart as-is
      }
    })();
  }, [isCustomer, hydrated]);

  // 4. Whenever the cart changes and the user is a logged-in customer, persist to server
  //    (debounced so rapid quantity clicks don't spam the API).
  useEffect(() => {
    if (!hydrated || !isCustomer) return;
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => {
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        }),
      }).catch(() => {
        // best-effort — cart still works locally even if this fails
      });
    }, 600);
    return () => {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
    };
  }, [lines, isCustomer, hydrated]);

  const addLine = useCallback((line: Omit<CartLine, "lineId">) => {
    setLines((prev) => {
      const existingIdx = prev.findIndex(
        (l) => l.productId === line.productId && l.specialInstructions === line.specialInstructions
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + line.quantity };
        return next;
      }
      return [...prev, { ...line, lineId: `${Date.now()}-${Math.random().toString(36).slice(2)}` }];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0 ? prev.filter((l) => l.lineId !== lineId) : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    if (isCustomer) {
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: [] }),
      }).catch(() => {});
    }
  }, [isCustomer]);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.price * l.quantity, 0), [lines]);
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, subtotal, itemCount, addLine, updateQuantity, removeLine, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
