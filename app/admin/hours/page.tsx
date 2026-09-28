import { getSettings } from "@/lib/utils/settings";
import HoursForm from "@/components/admin/HoursForm";

export const dynamic = "force-dynamic";

export default async function AdminHoursPage() {
  const settings = await getSettings();
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Store Hours</h1>
      <HoursForm initialHours={JSON.parse(JSON.stringify(settings.hours || {}))} />
    </div>
  );
}
