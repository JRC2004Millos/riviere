import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CartProvider } from "@/src/context/cart-context";
import { FacebookPixel } from "@/components/analytics/facebook-pixel";
import { hasActiveOffers } from "@/src/lib/products-store";

export const metadata: Metadata = {
  title: "RIVIERE | Camisas masculinas premium",
  description:
    "Catalogo visual de RIVIERE, una marca de camisas masculinas premium con mirada editorial.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showOffersLink = await hasActiveOffers();

  return (
    <html lang="es">
      <body>
        <FacebookPixel />
        <CartProvider>
          <Navbar showOffersLink={showOffersLink} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
