"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type OrderStatus = "PENDING_PAYMENT" | "PAID" | "FAILED" | "CANCELLED";

type OrderResponse = {
  status: OrderStatus;
  reference: string;
  total: number;
};

const MAX_RETRIES = 8;
const RETRY_DELAY = 2500;

export function ResultadoContent() {
  const params = useSearchParams();

  // Wompi solo agrega ?id={txn_id} al redirect URL
  const wompiId = params.get("id");
  // Fallback: si nuestra URL ?ref=xxx sobrevivió (depende de la versión de Wompi)
  const fallbackRef = params.get("ref");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<"not_found" | "no_id" | null>(null);

  useEffect(() => {
    if (!wompiId && !fallbackRef) {
      setError("no_id");
      return;
    }

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const url = wompiId
          ? `/api/checkout/transaction?id=${encodeURIComponent(wompiId)}`
          : `/api/orders/${encodeURIComponent(fallbackRef!)}`;

        const res = await fetch(url);

        if (res.status === 404) {
          if (!cancelled) setError("not_found");
          return;
        }

        const data = (await res.json()) as OrderResponse;
        if (!cancelled) setOrder(data);

        // Seguir reintentando si sigue pendiente
        if (data.status === "PENDING_PAYMENT" && attempts < MAX_RETRIES) {
          attempts++;
          timer = setTimeout(poll, RETRY_DELAY);
        }
      } catch {
        if (attempts < MAX_RETRIES) {
          attempts++;
          timer = setTimeout(poll, RETRY_DELAY);
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [wompiId, fallbackRef]);

  // ── Sin datos de Wompi ──────────────────────────────────────────────────────
  if (error === "no_id") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em]">
          No se recibió información de la transacción
        </p>
        <Button asChild variant="ghost" className="mt-8">
          <Link href="/carrito">Volver al carrito</Link>
        </Button>
      </div>
    );
  }

  // ── Orden no encontrada ─────────────────────────────────────────────────────
  if (error === "not_found") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em]">
          Referencia no encontrada
        </p>
        <Button asChild variant="ghost" className="mt-8">
          <Link href="/catalogo">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  // ── Cargando / pendiente ────────────────────────────────────────────────────
  if (!order || order.status === "PENDING_PAYMENT") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 h-6 w-6 animate-spin rounded-full border-2 border-riviere-ink border-t-transparent" />
        <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          Verificando pago…
        </p>
        {order?.reference && (
          <p className="mt-2 text-[11px] tracking-widest text-riviere-smoke/50">
            {order.reference}
          </p>
        )}
      </div>
    );
  }

  // ── Pago aprobado ───────────────────────────────────────────────────────────
  if (order.status === "PAID") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-600/30 bg-emerald-50">
          <span className="text-2xl text-emerald-600">✓</span>
        </div>
        <h1 className="text-xl font-light uppercase tracking-[0.22em]">
          Pago confirmado
        </h1>
        <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-riviere-smoke">
          Ref. {order.reference}
        </p>
        <p className="mt-4 max-w-xs text-sm text-riviere-smoke">
          Recibirás un correo de confirmación con los detalles de tu pedido.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-12 bg-riviere-ink text-white hover:bg-riviere-ink/90"
        >
          <Link href="/catalogo">Seguir explorando</Link>
        </Button>
      </div>
    );
  }

  // ── Pago fallido / cancelado ────────────────────────────────────────────────
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50">
        <span className="text-3xl leading-none text-red-400">×</span>
      </div>
      <h1 className="text-xl font-light uppercase tracking-[0.22em]">
        Pago no completado
      </h1>
      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-riviere-smoke">
        Ref. {order.reference}
      </p>
      <p className="mt-4 max-w-xs text-sm text-riviere-smoke">
        El pago no fue procesado. Puedes volver al carrito e intentarlo de nuevo.
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Button
          asChild
          size="lg"
          className="bg-riviere-ink text-white hover:bg-riviere-ink/90"
        >
          <Link href="/carrito">Reintentar</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
        >
          <Link href="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    </div>
  );
}
