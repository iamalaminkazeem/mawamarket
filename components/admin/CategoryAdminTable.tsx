"use client";

import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  _count: { products: number };
};

export default function CategoryAdminTable({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = name.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, sortOrder: categories.length }),
    });
    setSaving(false);
    if (res.ok) {
      const cat = await res.json();
      setCategories((prev) => [...prev, { ...cat, _count: { products: 0 } }]);
      setName("");
      setShowForm(false);
    } else {
      alert("Could not create category — the name/slug may already exist.");
    }
  }

  async function toggleVisible(id: string, visible: boolean) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, visible } : c)));
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible }),
    });
  }

  async function deleteCategory(id: string, productCount: number) {
    if (productCount > 0) {
      if (!confirm(`This category has ${productCount} product(s) which will also be deleted. Continue?`)) return;
    } else if (!confirm("Delete this category?")) {
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary !rounded-lg mb-6 text-sm">
        {showForm ? <X size={16} /> : <Plus size={16} />}
        {showForm ? "Cancel" : "Add Category"}
      </button>

      {showForm && (
        <form onSubmit={createCategory} className="bg-white rounded-2xl p-6 border border-black/5 mb-8 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frozen Foods"
              className="rounded-lg border border-black/10 px-3 py-2"
            />
          </div>
          <button disabled={saving} className="btn-primary !rounded-lg text-sm">
            {saving ? "Saving..." : "Create"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-market-cream text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-center">Products</th>
              <th className="px-4 py-3 text-center">Visible</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-center">{c._count.products}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleVisible(c.id, !c.visible)}>
                    {c.visible ? <Eye size={16} className="text-market-green" /> : <EyeOff size={16} className="text-black/30" />}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteCategory(c.id, c._count.products)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
