import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/carrito"
            className="transition-colors hover:text-riviere-ink"
          >
            Carrito
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Checkout</span>
        </nav>

        <h1 className="mb-14 text-xs uppercase tracking-[0.3em] text-riviere-smoke">
          Finalizar compra
        </h1>

        <CheckoutForm />
      </div>
    </main>
  );
}
