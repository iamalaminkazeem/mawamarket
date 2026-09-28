"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Phone } from "lucide-react";

type OrderItem = {
  id: string;
  itemNameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  subtotal: number;
  specialInstructions: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: "PICKUP" | "DELIVERY";
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  deliveryZip: string | null;
  deliveryInstructions: string | null;
  specialInstructions: string | null;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const statuses = ["RECEIVED", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersAdminTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  async function updateStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm border ${filter === "all" ? "bg-market-green text-white border-market-green" : "border-black/10"}`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm border capitalize ${filter === s ? "bg-market-green text-white border-market-green" : "border-black/10"}`}
          >
            {s.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : order.id)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>
                      {order.status.toLowerCase()}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-market-gold/20 text-market-charcoal capitalize">
                      {order.orderType.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-market-charcoal/60 mt-1">
                    {order.customerName} · {order.customerPhone} · ${order.total.toFixed(2)} ·{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-black/5 pt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium">Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="rounded-lg border border-black/10 px-3 py-1.5 text-sm capitalize"
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
                    </select>
                    <a href={`tel:${order.customerPhone}`} className="btn-secondary !py-1.5 !px-3 text-sm">
                      <Phone size={14} /> Call Customer
                    </a>
                  </div>

                  {order.orderType === "DELIVERY" && (
                    <div className="text-sm bg-market-cream rounded-lg p-3">
                      <p className="font-medium mb-1">Delivery Address</p>
                      <p>{order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState} {order.deliveryZip}</p>
                      {order.deliveryInstructions && <p className="text-market-charcoal/60 mt-1">Note: {order.deliveryInstructions}</p>}
                    </div>
                  )}

                  <div className="divide-y divide-black/5 border border-black/5 rounded-lg">
                    {order.items.map((item) => (
                      <div key={item.id} className="px-4 py-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.quantity}× {item.itemNameSnapshot}</span>
                          <span>${item.subtotal.toFixed(2)}</span>
                        </div>
                        {item.specialInstructions && (
                          <p className="text-market-charcoal/60 text-xs mt-1 italic">"{item.specialInstructions}"</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <p className="text-sm italic text-market-charcoal/60">Order note: "{order.specialInstructions}"</p>
                  )}

                  <div className="text-sm space-y-1 border-t border-black/5 pt-3">
                    <div className="flex justify-between"><span className="text-market-charcoal/60">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between"><span className="text-market-charcoal/60">Delivery Fee</span><span>${order.deliveryFee.toFixed(2)}</span></div>
                    )}
                    {order.tax > 0 && (
                      <div className="flex justify-between"><span className="text-market-charcoal/60">Tax</span><span>${order.tax.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-market-charcoal/50 py-12">No orders yet.</p>}
      </div>
    </div>
  );
}
