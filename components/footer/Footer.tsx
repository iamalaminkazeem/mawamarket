import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone } from "lucide-react";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82c-.98-.98-1.53-2.31-1.53-3.75h-3.45v13.6a2.7 2.7 0 1 1-2.7-2.7c.15 0 .3.01.44.03V9.6a6.15 6.15 0 1 0 5.71 6.13V9.05a7.6 7.6 0 0 0 4.53 1.48V7.08c-1.05 0-2.03-.34-2.83-.94l-.17-.32z" />
    </svg>
  );
}

export default function Footer({ settings }: { settings: any }) {
  return (
    <footer className="bg-market-charcoal text-market-cream/90 mt-20">
      <div className="container-market py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h3 className="font-serif text-2xl text-market-gold mb-3">{settings.storeName || "MaWa African Market"}</h3>
          <p className="text-sm text-market-cream/70">{settings.tagline}</p>
        </div>
        <div className="text-sm space-y-2">
          {settings.address && (
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-market-gold shrink-0" /> {settings.address}
            </p>
          )}
          {settings.phone && (
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-market-gold shrink-0" /> {settings.phone}
            </p>
          )}
          <div className="flex items-center gap-4 pt-1">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" className="hover:text-market-gold" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            )}
            {settings.tiktokUrl && (
              <a href={settings.tiktokUrl} target="_blank" className="hover:text-market-gold" aria-label="TikTok">
                <TikTokIcon size={18} />
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" className="hover:text-market-gold" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/shop" className="hover:text-market-gold">Shop</Link>
          <Link href="/about" className="hover:text-market-gold">About</Link>
          <Link href="/contact" className="hover:text-market-gold">Contact</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-market-cream/50">
        © {new Date().getFullYear()} {settings.storeName || "MaWa African Market"}. All rights reserved.
      </div>
    </footer>
  );
}
