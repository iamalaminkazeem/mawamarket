"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Save, Star, X, Search } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  priceVaries: boolean;
  imageUrl: string | null;
  categoryId: string;
  available: boolean;
  featured: boolean;
  notes: string | null;
};

export default function ProductAdminTable({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
    categoryId: categories[0]?.id || "",
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      if (query.trim() && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [products, query, categoryFilter]);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl || null,
        categoryId: form.categoryId,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);
      setForm({ name: "", price: "", imageUrl: "", categoryId: categories[0]?.id || "" });
      setShowForm(false);
    }
  }

  async function updateProduct(id: string, data: Partial<Product>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/products/${id}`, { method: "DELETE" });
  }

  const priceVariesCount = products.filter((p) => p.priceVaries).length;

  return (
    <div>
      {priceVariesCount > 0 && (
        <div className="bg-market-gold/10 border border-market-gold/30 rounded-xl px-4 py-3 text-sm mb-6">
          <strong>{priceVariesCount} product{priceVariesCount !== 1 ? "s" : ""}</strong> are priced by
          weight/at register and hidden from the shop until you set a real price and mark them available.
        </div>
      )}

      <button onClick={() => setShowForm(!showForm)} className="btn-primary !rounded-lg mb-6 text-sm">
        {showForm ? <X size={16} /> : <Plus size={16} />}
        {showForm ? "Cancel" : "Add Product"}
      </button>

      {showForm && (
        <form onSubmit={createProduct} className="bg-white rounded-2xl p-6 border border-black/5 mb-8 grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2"
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2"
          />
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="sm:col-span-2 flex items-center gap-3">
            <ImageUploader
              label={form.imageUrl ? "Change Photo" : "Upload Photo"}
              onUploaded={(url) => setForm({ ...form, imageUrl: url })}
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-black/10" />
            )}
          </div>
          <button disabled={saving} className="btn-primary !rounded-lg sm:col-span-2 justify-self-start text-sm">
            <Save size={16} /> {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
          <input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/10 text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <p className="text-xs text-market-charcoal/50 mb-3">
        Showing {filtered.length} of {products.length} products
      </p>

      <div className="bg-white rounded-2xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[780px]">
          <thead className="bg-market-cream text-left">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Available</th>
              <th className="px-4 py-3 text-center">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.slice(0, 100).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-black/10" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-market-green/5 flex items-center justify-center text-[9px] text-market-charcoal/30 text-center">
                        No photo
                      </div>
                    )}
                    <ImageUploader
                      label={p.imageUrl ? "Change" : "Upload"}
                      onUploaded={(url) => updateProduct(p.id, { imageUrl: url })}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">
                  {p.name}
                  {p.priceVaries && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-market-gold font-semibold">
                      Variable
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-market-charcoal/60">
                  {categories.find((c) => c.id === p.categoryId)?.name || "—"}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={p.price}
                    onBlur={(e) => updateProduct(p.id, { price: parseFloat(e.target.value) })}
                    className="w-20 rounded border border-black/10 px-2 py-1"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={p.available}
                    onChange={(e) => updateProduct(p.id, { available: e.target.checked })}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => updateProduct(p.id, { featured: !p.featured })}>
                    <Star size={18} className={p.featured ? "fill-market-gold text-market-gold" : "text-black/20"} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 100 && (
          <p className="text-center text-xs text-market-charcoal/40 py-3 border-t border-black/5">
            Showing first 100 results — refine your search to see more specific matches.
          </p>
        )}
        {filtered.length === 0 && (
          <p className="text-center text-market-charcoal/50 py-10">No products match your search.</p>
        )}
      </div>
    </div>
  );
}
