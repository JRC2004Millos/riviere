import { Suspense } from "react";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { getAllProducts } from "@/src/lib/products-store";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const productos = await getAllProducts();
  return (
    <main className="bg-riviere-bone pt-28">
      <section className="container pb-12 pt-14 md:pb-16 md:pt-20">
        <p className="text-xs uppercase tracking-[0.24em] text-riviere-smoke">
          Catálogo RIVIERE
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <h1 className="text-4xl font-medium uppercase tracking-[0.1em] md:text-6xl">
            ARCHIVO GIVENCHY
          </h1>
          <p className="max-w-md text-sm leading-6 text-riviere-smoke md:justify-self-end">
            Una curaduría de camisas Givenchy que privilegia la sobriedad, la
            calidad y la permanencia por encima de las tendencias.
          </p>
        </div>
      </section>
      <Suspense>
        <CatalogGrid products={productos} />
      </Suspense>
    </main>
  );
}
