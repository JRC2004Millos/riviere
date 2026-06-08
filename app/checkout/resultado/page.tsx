import { Suspense } from "react";
import { ResultadoContent } from "@/components/checkout/resultado-content";

export default function ResultadoPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <Suspense fallback={<ResultadoLoading />}>
        <ResultadoContent />
      </Suspense>
    </main>
  );
}

function ResultadoLoading() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24">
      <div className="mb-6 h-6 w-6 animate-spin rounded-full border-2 border-riviere-ink border-t-transparent" />
      <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
        Cargando…
      </p>
    </div>
  );
}
