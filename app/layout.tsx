import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation/Navigation";
import BottomNav from "@/components/navigation/BottomNav";
import Footer from "@/components/footer/Footer";
import { CartProvider } from "@/lib/cart/CartContext";
import FloatingCartButton from "@/components/cart/FloatingCartButton";
import { getSettings } from "@/lib/utils/settings";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MaWa African Market | Authentic African & Caribbean Groceries",
  description:
    "MaWa African Market brings authentic African and Caribbean groceries to Atlanta. Shop online for pickup or delivery.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-market-cream text-market-charcoal`}>
        <AuthSessionProvider>
          <CartProvider>
            {settings.announcementEnabled && settings.announcementText && (
              <div className="bg-market-green text-market-cream text-center text-sm py-2 px-4">
                {settings.announcementText}
              </div>
            )}
            <Navigation settings={settings} />
            <main>{children}</main>
            <Footer settings={settings} />
            <BottomNav />
            <FloatingCartButton />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}