"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/src/context/cart-context";
import { Button } from "@/components/ui/button";

const fmt = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function CarritoPage() {
  const { items, totalItems, subtotal, removeItem, updateQty, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-20 text-[#111]">
        <div className="container flex flex-col items-center justify-center py-40">
          <Image
            src="/images/Rivie sorprendido.png"
            alt="Carrito vacío"
            width={150}
            height={150}
            className="mb-10"
          />
          <p className="text-xs uppercase tracking-[0.3em] text-riviere-smoke">
            Tu carrito
          </p>
          <p className="mt-3 text-2xl font-light tracking-wide">está vacío</p>
          <Button
            asChild
            variant="outline"
            className="mt-10 border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
          >
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-14">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-riviere-smoke">
              Tu carrito
            </p>
            <h1 className="mt-2 text-3xl font-light uppercase tracking-[0.15em]">
              {totalItems} {totalItems === 1 ? "producto" : "productos"}
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs uppercase tracking-[0.18em] text-riviere-smoke underline-offset-4 hover:text-riviere-ink hover:underline"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* Lista */}
          <div className="divide-y divide-riviere-ink/8">
            {items.map((item) => (
              <div
                key={item.cartKey}
                className="grid grid-cols-[72px_1fr_auto] gap-5 py-6"
              >
                <div className="relative h-24 w-[72px] overflow-hidden bg-riviere-stone">
                  <Image
                    src={item.imagen}
                    alt={item.estilo}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-riviere-smoke">
                      RIVIERE
                    </p>
                    <p className="mt-0.5 font-light uppercase tracking-[0.16em]">
                      {item.estilo}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-riviere-smoke">
                      Talla {item.talla}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <p className="text-sm text-riviere-smoke">
                        {fmt.format(item.precio)}
                      </p>
                      {item.dcto ? (
                        <>
                          <p className="text-xs text-riviere-smoke/50 line-through tabular-nums">
                            {fmt.format(item.precioOriginal)}
                          </p>
                          <span className="text-[10px] uppercase tracking-[0.1em] text-emerald-700">
                            -{item.dcto}%
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() =>
                        item.cantidad > 1
                          ? updateQty(item.cartKey, item.cantidad - 1)
                          : removeItem(item.cartKey)
                      }
                      className="flex h-7 w-7 items-center justify-center border border-riviere-ink/15 transition-colors hover:border-riviere-ink"
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => updateQty(item.cartKey, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stockMax}
                      className="flex h-7 w-7 items-center justify-center border border-riviere-ink/15 transition-colors hover:border-riviere-ink disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    {item.cantidad >= item.stockMax && (
                      <span className="text-[10px] uppercase tracking-[0.12em] text-riviere-smoke/50">
                        Máx. disponible
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.cartKey)}
                    className="text-riviere-smoke/40 transition-colors hover:text-riviere-ink"
                    aria-label={`Eliminar ${item.estilo}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex flex-col items-end gap-0.5">
                    <p className="text-sm font-light tabular-nums">
                      {fmt.format(item.precio * item.cantidad)}
                    </p>
                    {item.dcto ? (
                      <p className="text-xs text-riviere-smoke/40 line-through tabular-nums">
                        {fmt.format(item.precioOriginal * item.cantidad)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-riviere-ink/10 bg-riviere-bone p-8">
              <p className="mb-6 text-xs uppercase tracking-[0.24em] text-riviere-smoke">
                Resumen del pedido
              </p>

              {(() => {
                const ahorro = items.reduce(
                  (s, i) => s + (i.precioOriginal - i.precio) * i.cantidad,
                  0,
                );
                return (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-riviere-smoke">
                        {totalItems} {totalItems === 1 ? "producto" : "productos"}
                      </span>
                      <span className="tabular-nums">{fmt.format(subtotal)}</span>
                    </div>
                    {ahorro > 0 && (
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>Ahorro</span>
                        <span className="tabular-nums">-{fmt.format(ahorro)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-riviere-smoke/60">
                      <span>Envío</span>
                      <span>A calcular</span>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-5 flex items-center justify-between border-t border-riviere-ink/10 pt-5">
                <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
                  Subtotal
                </span>
                <span className="text-lg font-light tabular-nums">
                  {fmt.format(subtotal)}
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="mt-8 w-full bg-riviere-ink text-white hover:bg-riviere-ink/90"
              >
                <Link href="/checkout">Finalizar compra</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-3 w-full border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
              >
                <Link href="/catalogo">Seguir comprando</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
