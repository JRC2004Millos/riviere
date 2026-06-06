import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { productos } from "@/src/data/productos";

export default function CatalogoPage() {
  return (
    <main className="bg-riviere-bone pt-28">
      <section className="container pb-12 pt-14 md:pb-16 md:pt-20">
        <p className="text-xs uppercase tracking-[0.24em] text-riviere-smoke">
          Catalogo RIVIERE
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <h1 className="text-4xl font-medium uppercase tracking-[0.1em] md:text-6xl">
            Camisas para una presencia precisa
          </h1>
          <p className="max-w-md text-sm leading-6 text-riviere-smoke md:justify-self-end">
            Una seleccion local de estilos RIVIERE para validar busqueda,
            filtros y ordenamiento antes de conectar base de datos.
          </p>
        </div>
      </section>
      <CatalogGrid products={productos} />
    </main>
  );
}
