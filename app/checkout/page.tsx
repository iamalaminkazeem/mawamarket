export const dynamic = "force-dynamic";

import { getSettings } from "@/lib/utils/settings";
import CheckoutForm from "@/components/cart/CheckoutForm";

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <div className="container-market py-16 max-w-2xl mx-auto">
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
