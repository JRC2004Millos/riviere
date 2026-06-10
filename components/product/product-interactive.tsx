"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/src/context/cart-context";
import type { ProductVariant } from "@/src/lib/products-store";
import { Button } from "@/components/ui/button";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

interface Props {
  id: string;
  estilo: string;
  nombre: string;
  precio: number;
  dcto: number | null;
  imagenDefault: string;
  variantes: ProductVariant[];
  tallas: string[];   // ya ordenadas (vienen de products-store)
  colores: string[];  // colores únicos (excluyen "")
  caracteristicas: string;
  categoria: string;
  mangaCorta: boolean;
  disponible: boolean;
}

export function ProductInteractive({
  id,
  estilo,
  nombre,
  precio,
  dcto,
  imagenDefault,
  variantes,
  tallas,
  colores,
  caracteristicas,
  categoria,
  mangaCorta,
  disponible,
}: Props) {
  const precioFinal = dcto ? Math.round(precio * (1 - dcto / 100)) : precio;
  const { addItem, items } = useCart();

  const tieneColores = colores.length > 1;
  // Si hay un solo color con nombre, es automático; si es "", no se muestra
  const colorAuto = !tieneColores && colores.length === 1 ? colores[0] : "";

  const [colorSeleccionado, setColorSeleccionado] = useState<string>(
    tieneColores ? "" : colorAuto,
  );
  const [imagenActual, setImagenActual] = useState(imagenDefault);
  const [imagenCargando, setImagenCargando] = useState(false);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>("");
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);

  // Variante activa según selección actual
  const varianteActiva = tallaSeleccionada
    ? variantes.find(
        (v) => v.talla === tallaSeleccionada && v.color === colorSeleccionado,
      ) ?? null
    : null;

  const variantStock = varianteActiva?.cantidad ?? 0;

  // Descuenta lo que ya está en el carrito para esta variante exacta
  const currentCartKey =
    tallaSeleccionada
      ? colorSeleccionado
        ? `${estilo}-${colorSeleccionado}-${tallaSeleccionada}`
        : `${estilo}-${tallaSeleccionada}`
      : null;

  const cantidadEnCarrito =
    currentCartKey == null
      ? 0
      : (items.find((i) => i.cartKey === currentCartKey)?.cantidad ?? 0);

  const disponibleParaAgregar = Math.max(0, variantStock - cantidadEnCarrito);

  function handleColorChange(color: string) {
    setColorSeleccionado(color);
    setAdded(false);
    setCantidad(1);
    setImagenCargando(true);
    const colorFile = color.trim().toUpperCase().replace(/\s+/g, "-");
    setImagenActual(`/images/${estilo}-${colorFile}.png`);
  }

  function handleTallaChange(talla: string) {
    setTallaSeleccionada(talla);
    setAdded(false);
    setCantidad(1);
  }

  function handleAdd() {
    if (!tallaSeleccionada || !currentCartKey) return;
    if (tieneColores && !colorSeleccionado) return;
    if (disponibleParaAgregar <= 0) return;

    addItem(
      {
        cartKey: currentCartKey,
        id,
        estilo,
        talla: tallaSeleccionada,
        color: colorSeleccionado || undefined,
        precio: precioFinal,
        precioOriginal: precio,
        dcto: dcto ?? null,
        imagen: imagenActual,
        stockMax: variantStock,
      },
      cantidad,
    );
    setAdded(true);
  }

  // Talla disponible = variante con stock > 0 para el color elegido
  function tallaDisponible(talla: string): boolean {
    const v = variantes.find(
      (v) => v.talla === talla && v.color === colorSeleccionado,
    );
    return (v?.cantidad ?? 0) > 0;
  }

  const canAdd =
    tallaSeleccionada !== "" &&
    (!tieneColores || colorSeleccionado !== "") &&
    disponibleParaAgregar > 0;

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-20">
      {/* Galería */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-[4/5] overflow-hidden bg-riviere-stone">
          <Image
            src={imagenActual}
            alt={`Camisa RIVIERE estilo ${estilo}`}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-300 ${imagenCargando ? "opacity-50" : "opacity-100"}`}
            onLoad={() => setImagenCargando(false)}
            onError={() => {
              setImagenActual(imagenDefault);
              setImagenCargando(false);
            }}
          />
          {imagenCargando && (
            <div className="absolute inset-0 animate-pulse bg-riviere-stone/50" />
          )}
        </div>
      </div>

      {/* Información + controles */}
      <div className="flex flex-col justify-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-riviere-smoke">
          {categoria}
        </p>

        <h1 className="text-3xl font-light uppercase tracking-[0.2em] md:text-4xl">
          {nombre || estilo}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          {estilo}
        </p>

        <div className="mt-5 flex items-baseline gap-3">
          <p className="text-2xl font-light">
            {currencyFormatter.format(precioFinal)}
          </p>
          {dcto && (
            <>
              <p className="text-sm text-riviere-smoke line-through">
                {currencyFormatter.format(precio)}
              </p>
              <span className="text-xs uppercase tracking-[0.1em] text-red-600">
                -{dcto}%
              </span>
            </>
          )}
        </div>

        <div className="mt-8 space-y-7 border-t border-riviere-ink/10 pt-8">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
              Características
            </p>
            <p className="text-sm tracking-wide text-riviere-smoke">
              {caracteristicas || "Diseño clásico"}
              {" · "}
              {mangaCorta ? "Manga corta" : "Manga larga"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full ${
                disponible ? "bg-emerald-600" : "bg-riviere-smoke/50"
              }`}
            />
            <span className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
              {disponible ? "Disponible" : "Agotado"}
            </span>
          </div>
        </div>

        {disponible && (
          <div className="mt-12 flex flex-col gap-5">
            {/* Color — solo si hay varios */}
            {tieneColores && (
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
                  Color{colorSeleccionado ? ` — ${colorSeleccionado}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colores.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleColorChange(c)}
                      className={`border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors ${
                        colorSeleccionado === c
                          ? "border-riviere-ink bg-riviere-ink text-white"
                          : "border-riviere-ink/15 hover:border-riviere-ink"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Talla */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
                Talla{tallaSeleccionada ? ` — ${tallaSeleccionada}` : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {tallas.map((t) => {
                  const hayStock = tallaDisponible(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => hayStock && handleTallaChange(t)}
                      disabled={!hayStock}
                      className={`border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors ${
                        tallaSeleccionada === t
                          ? "border-riviere-ink bg-riviere-ink text-white"
                          : hayStock
                            ? "border-riviere-ink/15 hover:border-riviere-ink"
                            : "border-riviere-ink/8 text-riviere-smoke/30 line-through cursor-not-allowed"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <Link
                href="/guia-de-tallas"
                className="mt-3 inline-block text-[11px] uppercase tracking-[0.14em] text-riviere-smoke/60 transition-colors hover:text-riviere-ink"
              >
                Guía de tallas →
              </Link>
            </div>

            {/* Cantidad */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
                Cantidad
                {cantidadEnCarrito > 0 && (
                  <span className="ml-2 normal-case tracking-normal text-riviere-smoke/60">
                    ({cantidadEnCarrito} en carrito · {disponibleParaAgregar} disponible
                    {disponibleParaAgregar !== 1 ? "s" : ""})
                  </span>
                )}
              </p>
              <div className="flex w-fit items-center border border-riviere-ink/15">
                <button
                  type="button"
                  onClick={() => setCantidad((q) => Math.max(1, q - 1))}
                  disabled={cantidad <= 1}
                  className="px-4 py-2 text-sm transition-colors hover:bg-riviere-stone disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-10 select-none text-center text-sm tabular-nums">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCantidad((q) => Math.min(disponibleParaAgregar, q + 1))
                  }
                  disabled={cantidad >= disponibleParaAgregar || !tallaSeleccionada}
                  className="px-4 py-2 text-sm transition-colors hover:bg-riviere-stone disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAdd}
                disabled={!canAdd}
                size="lg"
                className={`w-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  added
                    ? "border-emerald-700 bg-emerald-700 hover:bg-emerald-700"
                    : "border-riviere-ink bg-riviere-ink hover:bg-riviere-ink/85"
                } text-white`}
              >
                {added ? "Agregado al carrito ✓" : "Agregar al carrito"}
              </Button>

              {added && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-riviere-ink text-riviere-ink hover:bg-riviere-ink hover:text-white"
                >
                  <Link href="/carrito">Ver carrito →</Link>
                </Button>
              )}
            </div>
          </div>
        )}

        <div className={disponible ? "mt-4" : "mt-12"}>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
          >
            <Link href="/catalogo">← Volver al catálogo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
