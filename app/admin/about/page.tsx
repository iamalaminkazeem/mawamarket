import { getSettings } from "@/lib/utils/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const settings = await getSettings();
  return (
    <SettingsForm
      title="About Page"
      initialValues={JSON.parse(JSON.stringify(settings))}
      fields={[
        { key: "aboutHeadline", label: "About Page Headline" },
        { key: "aboutBody", label: "Our Story", type: "textarea" },
        { key: "aboutImageUrl", label: "About Page Image", type: "image" },
      ]}
    />
  );
}
