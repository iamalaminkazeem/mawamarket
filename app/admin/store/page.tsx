import { getSettings } from "@/lib/utils/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminStorePage() {
  const settings = await getSettings();
  return (
    <SettingsForm
      title="Store Info"
      initialValues={JSON.parse(JSON.stringify(settings))}
      fields={[
        { key: "storeName", label: "Store Name" },
        { key: "tagline", label: "Tagline" },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone Number" },
        { key: "whatsappNumber", label: "WhatsApp Number (digits only, with country code)", placeholder: "14045551234" },
        { key: "email", label: "Contact Email" },
        { key: "googleMapsUrl", label: "Google Maps Link (for 'Get Directions')", type: "url" },
        { key: "googleMapsEmbedUrl", label: "Google Maps Embed URL (for map on homepage)", type: "url" },
        { key: "instagramUrl", label: "Instagram URL", type: "url" },
        { key: "tiktokUrl", label: "TikTok URL", type: "url" },
        { key: "facebookUrl", label: "Facebook URL", type: "url" },
      ]}
    />
  );
}
