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

export function ResultadoContent() {
  const params = useSearchParams();
  const ref = params.get("ref");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ref) {
      setNotFound(true);
      return;
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 20;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${ref}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = (await res.json()) as OrderResponse;
        setOrder(data);
        if (data.status === "PENDING_PAYMENT" && attempts < MAX_ATTEMPTS) {
          attempts++;
          timer = setTimeout(poll, 2000);
        }
      } catch {
        // Network error — retry
        if (attempts < MAX_ATTEMPTS) {
          attempts++;
          timer = setTimeout(poll, 3000);
        }
      }
    };

    poll();
    return () => clearTimeout(timer);
  }, [ref]);

  if (notFound || !ref) {
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

  if (!order || order.status === "PENDING_PAYMENT") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 h-6 w-6 animate-spin rounded-full border-2 border-riviere-ink border-t-transparent" />
        <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          Verificando pago…
        </p>
        <p className="mt-2 text-[11px] tracking-widest text-riviere-smoke/50">
          {ref}
        </p>
      </div>
    );
  }

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
          Ref. {ref}
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

  // FAILED or CANCELLED
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50">
        <span className="text-3xl leading-none text-red-400">×</span>
      </div>
      <h1 className="text-xl font-light uppercase tracking-[0.22em]">
        Pago no completado
      </h1>
      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-riviere-smoke">
        Ref. {ref}
      </p>
      <p className="mt-4 max-w-xs text-sm text-riviere-smoke">
        El pago no fue procesado. Puedes volver al carrito e intentarlo de
        nuevo.
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
