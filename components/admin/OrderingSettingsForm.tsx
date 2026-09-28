"use client";

import { useState } from "react";
import { Save } from "lucide-react";

type Values = {
  orderingEnabled: boolean;
  orderButtonText: string;
  deliveryEnabled: boolean;
  deliveryFee: number | null;
  deliveryMinimum: number | null;
  deliveryNote: string | null;
  taxEnabled: boolean;
  taxMode: string;
  taxRate: number | null;
  taxFlatAmount: number | null;
  orderReceivedNote: string;
};

export default function OrderingSettingsForm({ initialValues }: { initialValues: Values }) {
  const [v, setV] = useState<Values>(initialValues);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <form onSubmit={save} className="bg-white rounded-2xl border border-black/5 p-6 space-y-6">
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={v.orderingEnabled} onChange={(e) => setV({ ...v, orderingEnabled: e.target.checked })} />
        Online ordering enabled
      </label>

      <div>
        <label className="block text-sm font-medium mb-1.5">Shop Button Text</label>
        <input value={v.orderButtonText} onChange={(e) => setV({ ...v, orderButtonText: e.target.value })} className="w-full rounded-lg border border-black/10 px-3 py-2" />
      </div>

      <hr className="border-black/5" />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={v.deliveryEnabled} onChange={(e) => setV({ ...v, deliveryEnabled: e.target.checked })} />
        Delivery available (uncheck to only offer Pickup)
      </label>

      {v.deliveryEnabled && (
        <div className="grid sm:grid-cols-2 gap-4 pl-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Delivery Fee ($)</label>
            <input type="number" step="0.01" value={v.deliveryFee ?? ""} onChange={(e) => setV({ ...v, deliveryFee: e.target.value ? parseFloat(e.target.value) : null })} placeholder="Leave blank to confirm by phone" className="w-full rounded-lg border border-black/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Minimum Delivery Order ($)</label>
            <input type="number" step="0.01" value={v.deliveryMinimum ?? ""} onChange={(e) => setV({ ...v, deliveryMinimum: e.target.value ? parseFloat(e.target.value) : null })} className="w-full rounded-lg border border-black/10 px-3 py-2" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Delivery Note</label>
            <input value={v.deliveryNote ?? ""} onChange={(e) => setV({ ...v, deliveryNote: e.target.value })} placeholder="e.g. Delivery available within 5 miles" className="w-full rounded-lg border border-black/10 px-3 py-2" />
          </div>
        </div>
      )}

      <hr className="border-black/5" />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={v.taxEnabled} onChange={(e) => setV({ ...v, taxEnabled: e.target.checked })} />
        Add tax to orders
      </label>

      {v.taxEnabled && (
        <div className="pl-6 space-y-3">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="taxMode" checked={v.taxMode === "percentage"} onChange={() => setV({ ...v, taxMode: "percentage" })} />
              Percentage of order
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="taxMode" checked={v.taxMode === "flat"} onChange={() => setV({ ...v, taxMode: "flat" })} />
              Flat fee ($)
            </label>
          </div>
          {v.taxMode === "percentage" ? (
            <div>
              <label className="block text-sm font-medium mb-1.5">Tax Rate (%)</label>
              <input type="number" step="0.01" value={v.taxRate ? v.taxRate * 100 : ""} onChange={(e) => setV({ ...v, taxRate: e.target.value ? parseFloat(e.target.value) / 100 : null })} placeholder="e.g. 8.9 for 8.9%" className="w-40 rounded-lg border border-black/10 px-3 py-2" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1.5">Flat Tax Amount ($)</label>
              <input type="number" step="0.01" value={v.taxFlatAmount ?? ""} onChange={(e) => setV({ ...v, taxFlatAmount: e.target.value ? parseFloat(e.target.value) : null })} className="w-40 rounded-lg border border-black/10 px-3 py-2" />
            </div>
          )}
        </div>
      )}

      <hr className="border-black/5" />

      <div>
        <label className="block text-sm font-medium mb-1.5">Order Confirmation Message</label>
        <textarea rows={2} value={v.orderReceivedNote} onChange={(e) => setV({ ...v, orderReceivedNote: e.target.value })} className="w-full rounded-lg border border-black/10 px-3 py-2" />
      </div>

      <button disabled={saving} className="btn-primary !rounded-lg text-sm">
        <Save size={16} /> {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
      </button>
    </form>
  );
}
