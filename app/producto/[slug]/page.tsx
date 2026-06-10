import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductByEstilo } from "@/src/lib/products-store";
import { getProductImage } from "@/src/lib/product-images";
import { getProductStyleCategory } from "@/src/lib/product-display";
import { ProductInteractive } from "@/components/product/product-interactive";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductByEstilo(slug);

  if (!product) notFound();

  const disponible = product.cantidad > 0;
  const categoria = getProductStyleCategory(product);

  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-6">
        <nav className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/catalogo"
            className="transition-colors hover:text-riviere-ink"
          >
            Catálogo
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">{product.estilo}</span>
        </nav>
      </div>

      <div className="container pb-24">
        <ProductInteractive
          id={product.id}
          estilo={product.estilo}
          nombre={product.nombre}
          precio={product.precio}
          dcto={product.dcto}
          imagenDefault={getProductImage(product.estilo)}
          variantes={product.variantes}
          tallas={product.tallas}
          colores={product.colores}
          caracteristicas={product.caracteristicas}
          categoria={categoria}
          mangaCorta={product.mangaCorta}
          disponible={disponible}
        />
      </div>
    </main>
  );
}
