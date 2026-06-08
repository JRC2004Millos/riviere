import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productos } from "@/src/data/productos";
import { getProductImage } from "@/src/lib/product-images";
import { getProductStyleCategory } from "@/src/lib/product-display";
import { Button } from "@/components/ui/button";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.estilo.toLowerCase() }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productos.find((p) => p.estilo.toLowerCase() === slug);

  if (!product) notFound();

  const disponible = product.cantidad > 0;
  const categoria = getProductStyleCategory(product);

  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      {/* Breadcrumb */}
      <div className="container py-6">
        <nav className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo" className="transition-colors hover:text-riviere-ink">
            Catálogo
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">{product.estilo}</span>
        </nav>
      </div>

      <div className="container pb-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          {/* Galería — preparada para múltiples imágenes futuras */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-riviere-stone">
              <Image
                src={getProductImage(product.estilo)}
                alt={`Camisa RIVIERE estilo ${product.estilo}`}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-riviere-smoke">
              {categoria}
            </p>

            <h1 className="text-3xl font-light uppercase tracking-[0.2em] md:text-4xl">
              {product.estilo}
            </h1>

            <p className="mt-5 text-2xl font-light">
              {currencyFormatter.format(product.precio)}
            </p>

            <div className="mt-8 space-y-7 border-t border-riviere-ink/10 pt-8">
              {/* Colores */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
                  Colores
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colores.map((color) => (
                    <span
                      key={color}
                      className="border border-riviere-ink/15 px-3 py-1 text-xs uppercase tracking-[0.14em]"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tallas */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
                  Tallas
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tallas.map((talla) => (
                    <span
                      key={talla}
                      className="border border-riviere-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.14em]"
                    >
                      {talla}
                    </span>
                  ))}
                </div>
              </div>

              {/* Características */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
                  Características
                </p>
                <p className="text-sm tracking-wide text-riviere-smoke">
                  {product.caracteristicas || "Diseño clásico"}
                  {" · "}
                  {product.mangaCorta ? "Manga corta" : "Manga larga"}
                </p>
              </div>

              {/* Estado inventario */}
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

            <div className="mt-12">
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
      </div>
    </main>
  );
}
