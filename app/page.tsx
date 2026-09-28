export const revalidate = 60;

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { getSettings } from "@/lib/utils/settings";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

export default async function HomePage() {
  const settings = await getSettings();

  let featured: any[] = [];
  let categories: any[] = [];
  try {
    featured = await prisma.product.findMany({
      where: { featured: true, available: true },
      take: 8,
      orderBy: { sortOrder: "asc" },
      include: { category: true },
    });
    if (featured.length === 0) {
      featured = await prisma.product.findMany({
        where: { available: true },
        take: 8,
        orderBy: { sortOrder: "asc" },
        include: { category: true },
      });
    }
    categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      take: 8,
    });
  } catch {
    featured = [];
    categories = [];
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {settings.heroImageUrl ? (
            <Image src={settings.heroImageUrl} alt={settings.storeName} fill priority className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-market-green via-market-green-dark to-market-charcoal" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          {/* floating decorative accents */}
          <div className="absolute top-24 right-16 w-24 h-24 rounded-full bg-market-gold/20 blur-2xl animate-floatSlow hidden sm:block" />
          <div
            className="absolute bottom-32 left-12 w-32 h-32 rounded-full bg-market-gold/10 blur-2xl animate-floatSlow hidden sm:block"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container-market relative z-10 text-market-cream">
          <div className="fade-up max-w-2xl">
            <span className="inline-block bg-market-gold text-market-charcoal text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              Now Shopping Online
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight mb-6">
              {settings.heroHeadline}
            </h1>
            <p className="text-lg text-market-cream/85 max-w-xl mb-9">{settings.heroSubtext}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">
                {settings.orderButtonText || "Shop Now"}
              </Link>
              <Link href="/about" className="btn-secondary !border-market-gold-light !text-market-cream hover:!text-market-charcoal">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY PREVIEW */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-market">
            <Reveal>
              <p className="uppercase tracking-[0.2em] text-market-gold text-xs font-semibold mb-3 text-center">
                Shop By Category
              </p>
              <h2 className="section-heading text-center mb-12">Everything You Need, All in One Place</h2>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {categories.map((c, i) => (
                <Reveal key={c.id} delay={i * 60}>
                  <Link href={`/shop?category=${c.slug}`}>
                    <TiltCard className="rounded-2xl bg-market-cream border border-black/5 p-6 text-center hover:shadow-lg transition-shadow h-full flex items-center justify-center">
                      <span className="font-medium text-sm">{c.name}</span>
                    </TiltCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="container-market">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <h2 className="section-heading">Featured Products</h2>
                <Link href="/shop" className="text-market-green font-medium hover:underline">
                  Shop All →
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <TiltCard className="group rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl bg-white h-full">
                    <div className="relative h-36 sm:h-44 bg-market-green/5">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-market-charcoal/30 text-xs">
                          Photo coming soon
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{p.name}</h3>
                      <span className="text-market-green font-semibold">${p.price.toFixed(2)}</span>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA STRIP */}
      <section className="py-20 bg-market-green text-market-cream text-center">
        <div className="container-market">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Taste of Home, Delivered to Your Door
            </h2>
            <p className="text-market-cream/80 mb-8 max-w-xl mx-auto">
              Shop hundreds of authentic African and Caribbean groceries online.
            </p>
            <Link href="/shop" className="btn-secondary !border-market-gold !text-market-cream hover:!text-market-charcoal hover:!bg-market-gold">
              {settings.orderButtonText || "Shop Now"}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
