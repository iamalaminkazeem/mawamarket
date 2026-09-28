"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("customer", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-5">
      <div className="text-center mb-2">
        <h1 className="font-serif text-2xl font-bold text-market-green">Welcome Back</h1>
        <p className="text-sm text-market-charcoal/60">Log in to track your orders</p>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

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
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-market-gold"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full !rounded-lg">
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-market-charcoal/60">
        New here?{" "}
        <Link href="/account/register" className="text-market-green font-medium hover:underline">
          Create an Account
        </Link>
      </p>
    </form>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-market-cream px-4 py-16">
      <Suspense fallback={<div className="text-market-charcoal/40">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
