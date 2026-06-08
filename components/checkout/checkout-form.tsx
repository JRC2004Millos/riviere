"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/src/context/cart-context";
import { Button } from "@/components/ui/button";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

type Fields = {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
};

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [fields, setFields] = useState<Fields>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-riviere-smoke">
          Tu carrito está vacío
        </p>
        <Button asChild variant="ghost" className="mt-8">
          <Link href="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            talla: i.talla,
            cantidad: i.cantidad,
          })),
          customer: {
            nombre: fields.nombre,
            email: fields.email,
            telefono: fields.telefono,
            direccion: fields.direccion,
          },
        }),
      });

      const data = (await res.json()) as { wompiUrl?: string; error?: string };

      if (!res.ok || !data.wompiUrl) {
        setError(data.error ?? "No se pudo crear la orden");
        setLoading(false);
        return;
      }

      clearCart();
      window.location.href = data.wompiUrl;
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-16 lg:grid-cols-[1fr_400px]"
    >
      {/* Resumen del pedido */}
      <div>
        <h2 className="mb-8 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
          Resumen del pedido
        </h2>

        <div className="divide-y divide-riviere-ink/10 border-y border-riviere-ink/10">
          {items.map((item) => (
            <div
              key={item.cartKey}
              className="flex items-center justify-between gap-4 py-5"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.14em]">
                  {item.estilo}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-riviere-smoke">
                  Talla {item.talla}
                  {" · "}
                  {item.cantidad === 1 ? "1 unidad" : `${item.cantidad} unidades`}
                </p>
              </div>
              <p className="text-sm tabular-nums">
                {COP.format(item.precio * item.cantidad)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
            Total
          </p>
          <p className="text-xl font-light tabular-nums">
            {COP.format(subtotal)}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="border-t border-riviere-ink/10 pt-8 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
        <h2 className="mb-8 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
          Información de contacto
        </h2>

        <div className="space-y-6">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
              Nombre completo *
            </span>
            <input
              name="nombre"
              required
              autoComplete="name"
              value={fields.nombre}
              onChange={handleChange}
              className="mt-2 w-full border-b border-riviere-ink/20 bg-transparent pb-2 text-sm outline-none transition-colors focus:border-riviere-ink"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
              Email *
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={fields.email}
              onChange={handleChange}
              className="mt-2 w-full border-b border-riviere-ink/20 bg-transparent pb-2 text-sm outline-none transition-colors focus:border-riviere-ink"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
              Teléfono
            </span>
            <input
              name="telefono"
              type="tel"
              autoComplete="tel"
              value={fields.telefono}
              onChange={handleChange}
              className="mt-2 w-full border-b border-riviere-ink/20 bg-transparent pb-2 text-sm outline-none transition-colors focus:border-riviere-ink"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
              Dirección de entrega
            </span>
            <input
              name="direccion"
              autoComplete="street-address"
              value={fields.direccion}
              onChange={handleChange}
              className="mt-2 w-full border-b border-riviere-ink/20 bg-transparent pb-2 text-sm outline-none transition-colors focus:border-riviere-ink"
            />
          </label>
        </div>

        {error && (
          <p className="mt-6 text-xs uppercase tracking-[0.12em] text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="mt-10 w-full bg-riviere-ink text-white hover:bg-riviere-ink/90 disabled:opacity-50"
        >
          {loading
            ? "Procesando..."
            : `Pagar ${COP.format(subtotal)} con Wompi`}
        </Button>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-riviere-smoke/70">
          Serás redirigido a Wompi para completar el pago de forma segura
        </p>
      </div>
    </form>
  );
}
