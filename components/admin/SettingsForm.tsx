"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "checkbox" | "url" | "image";
  placeholder?: string;
};

export default function SettingsForm({
  title,
  fields,
  initialValues,
}: {
  title: string;
  fields: Field[];
  initialValues: Record<string, any>;
}) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-8">{title}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
        {fields.map((f) => (
          <div key={f.key}>
            {f.type !== "checkbox" && <label className="block text-sm font-medium mb-1.5">{f.label}</label>}
            {f.type === "textarea" ? (
              <textarea
                rows={4}
                placeholder={f.placeholder}
                value={values[f.key] || ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-gold"
              />
            ) : f.type === "checkbox" ? (
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={!!values[f.key]}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.checked })}
                />
                {f.label}
              </label>
            ) : f.type === "image" ? (
              <div className="flex items-center gap-3">
                <ImageUploader
                  label={values[f.key] ? "Change Photo" : "Upload Photo"}
                  onUploaded={(url) => setValues({ ...values, [f.key]: url })}
                />
                {values[f.key] && (
                  <img src={values[f.key]} alt={f.label} className="h-14 w-14 rounded-lg object-cover border border-black/10" />
                )}
              </div>
            ) : (
              <input
                type={f.type === "url" ? "url" : "text"}
                placeholder={f.placeholder}
                value={values[f.key] || ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-gold"
              />
            )}
          </div>
        ))}
        <button disabled={saving} className="btn-primary !rounded-lg text-sm">
          <Save size={16} /> {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
