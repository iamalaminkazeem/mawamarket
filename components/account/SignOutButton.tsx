"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 text-sm text-market-charcoal/60 hover:text-market-charcoal"
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}
