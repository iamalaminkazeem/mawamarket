export const revalidate = 60;

import Image from "next/image";
import { getSettings } from "@/lib/utils/settings";
import Reveal from "@/components/ui/Reveal";

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="container-market py-16 max-w-3xl mx-auto">
      <Reveal>
        <p className="uppercase tracking-[0.2em] text-market-gold text-xs font-semibold mb-4 text-center">
          Our Story
        </p>
        <h1 className="section-heading text-center mb-10">
          {settings.aboutHeadline || `About ${settings.storeName}`}
        </h1>
      </Reveal>

      {settings.aboutImageUrl && (
        <Reveal delay={100}>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
            <Image src={settings.aboutImageUrl} alt={settings.storeName} fill className="object-cover" />
          </div>
        </Reveal>
      )}

      <Reveal delay={200}>
        <div className="prose prose-lg max-w-none text-market-charcoal/75 leading-relaxed">
          {settings.aboutBody ? (
            <p>{settings.aboutBody}</p>
          ) : (
            <p>
              {settings.storeName} brings authentic African and Caribbean groceries to the
              community — from pantry staples to specialty ingredients that taste like home. Our
              official story is coming soon — check back shortly.
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
