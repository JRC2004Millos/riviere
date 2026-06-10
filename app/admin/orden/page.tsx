import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getAllProducts } from "@/src/lib/products-store";
import { ProductSortList } from "@/components/admin/product-sort-list";

export const dynamic = "force-dynamic";

export default async function AdminOrdenPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const products = await getAllProducts();

  const sortProducts = products.map((p) => ({
    id: p.id,
    estilo: p.estilo,
    nombre: p.nombre,
    hasImage: p.hasImage,
  }));

  return (
    <main className="min-h-screen bg-riviere-bone pt-20 text-[#111]">
      <div className="container max-w-2xl py-10">
        <nav className="mb-8 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/admin" className="transition-colors hover:text-riviere-ink">
            Admin
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Orden del catálogo</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-light uppercase tracking-[0.18em]">
            Orden del catálogo
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-riviere-smoke">
            Arrastra los productos para definir el orden editorial. Guarda cuando termines.
          </p>
        </div>

        <ProductSortList products={sortProducts} />
      </div>
    </main>
  );
}
