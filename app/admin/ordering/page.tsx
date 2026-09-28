import { getSettings } from "@/lib/utils/settings";
import OrderingSettingsForm from "@/components/admin/OrderingSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminOrderingPage() {
  const settings = await getSettings();
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-2">Online Ordering</h1>
      <p className="text-sm text-market-charcoal/60 mb-8">
        Customers shop and check out directly on the site — no external platform. Configure delivery
        and tax below.
      </p>
      <OrderingSettingsForm initialValues={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
