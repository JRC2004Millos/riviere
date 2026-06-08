"use client";
import { useState } from "react";
import { useCart } from "@/src/context/cart-context";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  estilo: string;
  precio: number;
  imagen: string;
  tallas: string[];
  stockMax: number;
}

export function AddToCartButton({
  id,
  estilo,
  precio,
  imagen,
  tallas,
  stockMax,
}: Props) {
  const { addItem } = useCart();
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(
    null,
  );
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!tallaSeleccionada) return;
    addItem({
      cartKey: `${estilo}-${tallaSeleccionada}`,
      id,
      estilo,
      talla: tallaSeleccionada,
      precio,
      imagen,
      stockMax,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Selector de talla */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          Selecciona una talla
        </p>
        <div className="flex flex-wrap gap-2">
          {tallas.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTallaSeleccionada(t)}
              className={`border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors ${
                tallaSeleccionada === t
                  ? "border-riviere-ink bg-riviere-ink text-white"
                  : "border-riviere-ink/15 hover:border-riviere-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleAdd}
        disabled={!tallaSeleccionada}
        size="lg"
        className={`w-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          added
            ? "border-emerald-700 bg-emerald-700 hover:bg-emerald-700"
            : "border-riviere-ink bg-riviere-ink hover:bg-riviere-ink/85"
        } text-white`}
      >
        {added ? "Agregado al carrito ✓" : "Agregar al carrito"}
      </Button>
    </div>
  );
}
