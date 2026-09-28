export const revalidate = 60;

import { getSettings } from "@/lib/utils/settings";
import { MapPin, Phone, Mail, MessageCircle, Navigation as NavIcon } from "lucide-react";

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const dayLabels: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
  friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const hours = (settings.hours || {}) as Record<string, { open: string; close: string; closed: boolean }>;

  return (
    <div className="container-market py-16 max-w-4xl mx-auto grid sm:grid-cols-2 gap-12">
      <div>
        <h1 className="section-heading mb-6">Visit {settings.storeName}</h1>
        <div className="space-y-4 text-market-charcoal/75">
          {settings.address && (
            <p className="flex items-start gap-3"><MapPin size={20} className="text-market-gold shrink-0 mt-0.5" /> {settings.address}</p>
          )}
          {settings.phone && (
            <p className="flex items-center gap-3"><Phone size={20} className="text-market-gold shrink-0" /> {settings.phone}</p>
          )}
          {settings.email && (
            <p className="flex items-center gap-3"><Mail size={20} className="text-market-gold shrink-0" /> {settings.email}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="btn-secondary !py-2.5 !px-5 text-sm"><Phone size={16} /> Call</a>
          )}
          {settings.whatsappNumber && (
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, "")}`} target="_blank" className="btn-secondary !py-2.5 !px-5 text-sm">
              <MessageCircle size={16} /> WhatsApp
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="btn-secondary !py-2.5 !px-5 text-sm"><Mail size={16} /> Email</a>
          )}
          {settings.googleMapsUrl && (
            <a href={settings.googleMapsUrl} target="_blank" className="btn-primary !py-2.5 !px-5 text-sm"><NavIcon size={16} /> Directions</a>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Hours</h2>
        <div className="rounded-xl border border-black/5 bg-white divide-y divide-black/5">
          {dayOrder.map((d) => {
            const h = hours[d];
            return (
              <div key={d} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="font-medium">{dayLabels[d]}</span>
                <span className="text-market-charcoal/60">{!h || h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
