"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  productCount: number;
};

export function BulkDiscountControls({ productCount }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshAndClose(msg?: string) {
    if (msg) setMessage(msg);
    router.refresh();
    setOpen(false);
    setDiscount("");
    setQuantity("");
  }

  async function resetDiscounts() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/descuentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });

      const data = (await res.json()) as { ok?: boolean; updated?: number; error?: string };
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar los descuentos");
      await refreshAndClose(`Se eliminaron descuentos en ${data.updated ?? 0} productos.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function applyDiscounts() {
    const parsedDiscount = Number(discount);
    const parsedQuantity = Number(quantity);

    if (Number.isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      setMessage("Ingresa un porcentaje válido entre 0 y 100.");
      return;
    }
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setMessage("Ingresa una cantidad válida mayor a 0.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/descuentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply",
          discount: parsedDiscount,
          quantity: parsedQuantity,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        updated?: number;
        eligible?: number;
        error?: string;
      };

      if (!res.ok) throw new Error(data.error || "No se pudieron aplicar los descuentos");

      await refreshAndClose(
        `Se aplicó ${parsedDiscount}% a ${data.updated ?? 0} camisetas. Elegibles: ${data.eligible ?? 0}.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="outline"
        className="border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
        onClick={resetDiscounts}
        disabled={loading}
      >
        Eliminar descuentos
      </Button>

      <Button
        type="button"
        className="bg-riviere-ink text-white hover:bg-riviere-ink/85"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        Aplicar descuentos
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md border border-riviere-ink/10 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-riviere-smoke">
                  Descuento aleatorio
                </p>
                <h2 className="mt-2 text-xl font-light uppercase tracking-[0.12em]">
                  Aplicar descuentos
                </h2>
              </div>
              <button
                type="button"
                className="text-sm uppercase tracking-[0.18em] text-riviere-smoke transition hover:text-riviere-ink"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
                  Porcentaje
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="border border-riviere-ink/15 bg-transparent px-3 py-2 outline-none focus:border-riviere-ink"
                  placeholder="Ej: 20"
                  disabled={loading}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
                  Cantidad de camisetas
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="border border-riviere-ink/15 bg-transparent px-3 py-2 outline-none focus:border-riviere-ink"
                  placeholder={`Máx. ${productCount}`}
                  disabled={loading}
                />
              </label>
            </div>

            <p className="mt-4 text-xs leading-5 text-riviere-smoke">
              Se elegirán al azar solo productos sin descuento actual.
            </p>

            {message && (
              <p className="mt-4 border border-riviere-ink/10 bg-riviere-bone/40 px-3 py-2 text-sm text-riviere-ink">
                {message}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-riviere-ink text-white hover:bg-riviere-ink/85"
                onClick={applyDiscounts}
                disabled={loading}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
