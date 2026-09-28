import { prisma } from "@/lib/db/prisma";

export async function getSettings() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    });
    return settings;
  } catch {
    // DB not reachable at build time — return safe defaults so the site still renders
    return {
      id: "main",
      storeName: "MaWa African Market",
      tagline: "Your Taste of Home, In Every Aisle",
      address: null,
      phone: null,
      whatsappNumber: null,
      email: null,
      hours: {},
      heroHeadline: "Fresh African & Caribbean Groceries, Delivered With Care",
      heroSubtext: "Authentic ingredients, pantry staples, and specialty foods from home.",
      heroImageUrl: null,
      aboutHeadline: null,
      aboutBody: null,
      aboutImageUrl: null,
      orderingEnabled: true,
      orderButtonText: "Shop Now",
      deliveryEnabled: false,
      deliveryFee: null,
      deliveryMinimum: null,
      deliveryNote: null,
      taxEnabled: false,
      taxMode: "percentage",
      taxRate: null,
      taxFlatAmount: null,
      orderReceivedNote: "Your order has been received and will be reviewed by our team.",
      googleMapsUrl: null,
      googleMapsEmbedUrl: null,
      instagramUrl: null,
      facebookUrl: null,
      tiktokUrl: null,
      announcementEnabled: false,
      announcementText: null,
      updatedAt: new Date(),
    };
  }
}
