export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSettings } from "@/lib/utils/settings";
import CheckoutForm from "@/components/cart/CheckoutForm";

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <div className="container-market py-8 lg:py-16 max-w-2xl mx-auto">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 py-2 pr-3 mb-4 text-sm font-medium text-market-green hover:text-market-green-dark transition-colors"
      >
        <ArrowLeft size={18} />
        Back to cart
      </Link>
      <h1 className="section-heading mb-8 text-center">Checkout</h1>
      <CheckoutForm
        deliveryEnabled={settings.deliveryEnabled}
        deliveryFee={settings.deliveryFee}
        deliveryMinimum={settings.deliveryMinimum}
        deliveryNote={settings.deliveryNote}
        taxEnabled={settings.taxEnabled}
        taxMode={settings.taxMode}
        taxRate={settings.taxRate}
        taxFlatAmount={settings.taxFlatAmount}
        restaurantAddress={settings.address || ""}
      />
    </div>
  );
}