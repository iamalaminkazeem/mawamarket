"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const days = [
  ["monday", "Monday"], ["tuesday", "Tuesday"], ["wednesday", "Wednesday"],
  ["thursday", "Thursday"], ["friday", "Friday"], ["saturday", "Saturday"], ["sunday", "Sunday"],
] as const;

type DayHours = { open: string; close: string; closed: boolean };

export default function HoursForm({ initialHours }: { initialHours: Record<string, DayHours> }) {
  const [hours, setHours] = useState<Record<string, DayHours>>(() => {
    const base: Record<string, DayHours> = {};
    for (const [key] of days) {
      base[key] = initialHours[key] || { open: "9:00 AM", close: "8:00 PM", closed: false };
    }
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(day: string, field: keyof DayHours, value: string | boolean) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6">
      <div className="space-y-3">
        {days.map(([key, label]) => (
          <div key={key} className="flex items-center gap-3 flex-wrap">
            <span className="w-28 font-medium text-sm">{label}</span>
            <label className="flex items-center gap-1.5 text-sm text-market-charcoal/60">
              <input type="checkbox" checked={hours[key].closed} onChange={(e) => update(key, "closed", e.target.checked)} />
              Closed
            </label>
            {!hours[key].closed && (
              <>
                <input value={hours[key].open} onChange={(e) => update(key, "open", e.target.value)} placeholder="9:00 AM" className="w-28 rounded border border-black/10 px-2 py-1 text-sm" />
                <span className="text-sm text-market-charcoal/40">to</span>
                <input value={hours[key].close} onChange={(e) => update(key, "close", e.target.value)} placeholder="8:00 PM" className="w-28 rounded border border-black/10 px-2 py-1 text-sm" />
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="btn-primary !rounded-lg text-sm mt-6">
        <Save size={16} /> {saving ? "Saving..." : saved ? "Saved ✓" : "Save Hours"}
      </button>
    </div>
  );
}
