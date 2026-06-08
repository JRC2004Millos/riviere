import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  getProductByEstilo,
  saveProductOverride,
} from "@/src/lib/products-store";
import { generateProductName } from "@/src/lib/product-name";
import { getProductImage } from "@/src/lib/product-images";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const fmt = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ estilo: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { estilo } = await params;
  const { saved, error } = await searchParams;

  const product = await getProductByEstilo(estilo);
  if (!product) notFound();

  const productEstilo = product.estilo;
  const productColores = product.colores;
  const productMangaCorta = product.mangaCorta;

  async function handleSave(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s) redirect("/login");

    const precio = Number(formData.get("precio"));
    const cantidad = Number(formData.get("cantidad"));
    const descripcion = ((formData.get("descripcion") as string) ?? "").trim();
    const caracteristicas = (
      (formData.get("caracteristicas") as string) ?? ""
    ).trim();
    const material = ((formData.get("material") as string) ?? "").trim();

    if (isNaN(precio) || precio <= 0 || isNaN(cantidad) || cantidad < 0) {
      redirect(`/admin/productos/${productEstilo}?error=1`);
    }

    const nombre = generateProductName(
      caracteristicas,
      productColores,
      productMangaCorta,
    );

    await saveProductOverride(productEstilo, {
      precio,
      cantidad,
      descripcion,
      caracteristicas,
      nombre,
      material: material || null,
    });
    revalidatePath("/admin/productos");
    redirect(`/admin/productos/${productEstilo}?saved=1`);
  }

  return (
    <main className="min-h-screen bg-riviere-bone pt-20 text-[#111]">
      <div className="container max-w-2xl py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/admin" className="transition-colors hover:text-riviere-ink">
            Admin
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/admin/productos"
            className="transition-colors hover:text-riviere-ink"
          >
            Productos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">{product.estilo}</span>
        </nav>

        {/* Product header */}
        <div className="mb-8 grid gap-6 sm:grid-cols-[96px_1fr]">
          <div className="relative h-32 w-24 overflow-hidden bg-riviere-stone">
            {product.hasImage && (
              <Image
                src={getProductImage(product.estilo)}
                alt={product.estilo}
                fill
                sizes="96px"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            <p className="text-xs uppercase tracking-[0.28em] text-riviere-smoke">
              {product.caracteristicas || "Diseño clásico"}
            </p>
            <h1 className="text-2xl font-light uppercase tracking-[0.18em]">
              {product.estilo}
            </h1>
            <p className="text-sm text-riviere-smoke">
              Precio actual: {fmt.format(product.precio)}
            </p>
            <p className="text-sm text-riviere-smoke">
              Stock: {product.cantidad} · Tallas: {product.tallas.join(", ")}
            </p>
          </div>
        </div>

        {/* Feedback banners */}
        {saved && (
          <div className="mb-6 border-l-2 border-emerald-600 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
              Cambios guardados correctamente
            </p>
          </div>
        )}
        {error && (
          <div className="mb-6 border-l-2 border-red-500 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-red-600">
              Datos inválidos. Revisa precio y cantidad.
            </p>
          </div>
        )}

        {/* Edit form */}
        <form
          action={handleSave}
          className="border border-riviere-ink/10 bg-white p-6"
        >
          <p className="mb-6 text-xs uppercase tracking-[0.24em] text-riviere-smoke">
            Editar producto
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="precio"
                className="text-xs uppercase tracking-[0.18em] text-riviere-smoke"
              >
                Precio (COP)
              </label>
              <input
                id="precio"
                name="precio"
                type="number"
                min="1000"
                step="1000"
                defaultValue={product.precio}
                required
                className="border border-riviere-ink/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-riviere-ink"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="cantidad"
                className="text-xs uppercase tracking-[0.18em] text-riviere-smoke"
              >
                Cantidad en stock
              </label>
              <input
                id="cantidad"
                name="cantidad"
                type="number"
                min="0"
                step="1"
                defaultValue={product.cantidad}
                required
                className="border border-riviere-ink/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-riviere-ink"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <label
              htmlFor="caracteristicas"
              className="text-xs uppercase tracking-[0.18em] text-riviere-smoke"
            >
              Características
            </label>
            <input
              id="caracteristicas"
              name="caracteristicas"
              type="text"
              defaultValue={product.caracteristicas}
              className="border border-riviere-ink/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-riviere-ink"
            />
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <label
              htmlFor="material"
              className="text-xs uppercase tracking-[0.18em] text-riviere-smoke"
            >
              Material
            </label>
            <input
              id="material"
              name="material"
              type="text"
              defaultValue={product.material ?? ""}
              placeholder="Ej: Algodón 100%, Lino…"
              className="border border-riviere-ink/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-riviere-ink placeholder:text-riviere-smoke/30"
            />
          </div>

          {/* Nombre generado — solo lectura */}
          <div className="mt-5 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
              Nombre generado
            </p>
            <p className="border border-riviere-ink/8 bg-riviere-bone/50 px-3 py-2 text-sm text-riviere-smoke">
              {product.nombre ||
                generateProductName(
                  product.caracteristicas,
                  product.colores,
                  product.mangaCorta,
                )}
            </p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-riviere-smoke/50">
              Se actualiza automáticamente al guardar
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <label
              htmlFor="descripcion"
              className="text-xs uppercase tracking-[0.18em] text-riviere-smoke"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              defaultValue={product.descripcion ?? ""}
              placeholder="Descripción del producto..."
              className="resize-none border border-riviere-ink/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-riviere-ink placeholder:text-riviere-smoke/30"
            />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button
              type="submit"
              size="lg"
              className="border-riviere-ink bg-riviere-ink text-white hover:bg-riviere-ink/85"
            >
              Guardar cambios
            </Button>
            <Button asChild variant="ghost" className="text-riviere-smoke hover:text-riviere-ink">
              <Link href="/admin/productos">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
