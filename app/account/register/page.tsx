"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone: phone || null, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const fieldErrors = data.error?.fieldErrors ? (Object.values(data.error.fieldErrors).flat() as string[]) : [];
      const message =
        typeof data.error === "string"
          ? data.error
          : fieldErrors[0] || data.error?.formErrors?.[0] || "Could not create account.";
      setError(message);
      setLoading(false);
      return;
    }

    const signInRes = await signIn("customer", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      setError("Account created, but sign-in failed. Try logging in.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-market-cream px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-5">
        <div className="text-center mb-2">
          <h1 className="font-serif text-2xl font-bold text-market-green">Create Account</h1>
          <p className="text-sm text-market-charcoal/60">Track your orders and shop faster</p>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-gold"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full !rounded-lg">
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-market-charcoal/60">
          Already have an account?{" "}
          <Link href="/account/login" className="text-market-green font-medium hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
