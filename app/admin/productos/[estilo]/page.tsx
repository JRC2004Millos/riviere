import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  getProductByEstilo,
  saveProductOverride,
  upsertVariants,
  TALLA_ORDER,
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
    if (!product) return;

    const precio = Number(formData.get("precio"));
    const dctoRaw = (formData.get("dcto") as string ?? "").trim();
    const dcto = dctoRaw === "" ? null : Number(dctoRaw);
    const descripcion = ((formData.get("descripcion") as string) ?? "").trim();
    const caracteristicas = (
      (formData.get("caracteristicas") as string) ?? ""
    ).trim();
    const material = ((formData.get("material") as string) ?? "").trim();

    if (isNaN(precio) || precio <= 0) {
      redirect(`/admin/productos/${productEstilo}?error=1`);
    }
    if (dcto !== null && (isNaN(dcto) || dcto < 0 || dcto > 100)) {
      redirect(`/admin/productos/${productEstilo}?error=1`);
    }

    const coloresHidden = (formData.get("_colores") as string ?? "");
    const colores = coloresHidden ? coloresHidden.split(",").filter(Boolean) : [];
    const mangaCorta = formData.get("_manga_corta") === "1";
    const nombre = generateProductName(caracteristicas, colores, mangaCorta);

    await saveProductOverride(productEstilo, {
      precio,
      dcto,
      descripcion,
      caracteristicas,
      nombre,
      material: material || null,
    });

    // Upsert de todas las variantes (crea nuevas, actualiza existentes)
    const variantMap = new Map<string, { talla: string; color: string; cantidad: number; ubicacion: string }>();
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("upsert-")) {
        const [talla, color] = key.replace("upsert-", "").split("|");
        const cantidad = Number(value);
        if (talla && !isNaN(cantidad)) {
          const k = `${talla}|${color ?? ""}`;
          const existing = variantMap.get(k);
          variantMap.set(k, { talla, color: color ?? "", cantidad, ubicacion: existing?.ubicacion ?? "" });
        }
      }
      if (key.startsWith("ubicacion-")) {
        const [talla, color] = key.replace("ubicacion-", "").split("|");
        if (talla) {
          const k = `${talla}|${color ?? ""}`;
          const existing = variantMap.get(k);
          variantMap.set(k, { talla, color: color ?? "", cantidad: existing?.cantidad ?? 0, ubicacion: String(value).trim() });
        }
      }
    }
    if (variantMap.size > 0) {
      await upsertVariants(product.id, Array.from(variantMap.values()));
    }

    revalidatePath("/admin/productos");
    redirect(`/admin/productos/${productEstilo}?saved=1`);
  }

  const stockTotal = product.variantes.reduce((s, v) => s + v.cantidad, 0);

  return (
    <main className="min-h-screen bg-riviere-bone pt-20 text-[#111]">
      <div className="container max-w-2xl py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/admin" className="transition-colors hover:text-riviere-ink">Admin</Link>
          <span className="mx-2">/</span>
          <Link href="/admin/productos" className="transition-colors hover:text-riviere-ink">
            Productos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">{product.estilo}</span>
        </nav>

        {/* Cabecera del producto */}
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
              Precio: {fmt.format(product.precio)} · Stock total: {stockTotal}
            </p>
            <p className="text-sm text-riviere-smoke">
              {product.variantes.length} variante{product.variantes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Banners */}
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
              Datos inválidos. Revisa el precio.
            </p>
          </div>
        )}

        <form action={handleSave} className="space-y-6">
          <input type="hidden" name="_colores" value={productColores.join(",")} />
          <input type="hidden" name="_manga_corta" value={productMangaCorta ? "1" : "0"} />
          {/* Info general */}
          <div className="border border-riviere-ink/10 bg-white p-6">
            <p className="mb-6 text-xs uppercase tracking-[0.24em] text-riviere-smoke">
              Información general
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="precio" className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
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
                <label htmlFor="dcto" className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
                  Descuento % (0–100, dejar vacío = sin descuento)
                </label>
                <input
                  id="dcto"
                  name="dcto"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={product.dcto ?? ""}
                  placeholder="Ej: 20"
                  className="border border-riviere-ink/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-riviere-ink placeholder:text-riviere-smoke/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="material" className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
                  Material
                </label>
                <input
                  id="material"
                  name="material"
                  type="text"
                  defaultValue={product.material ?? ""}
                  placeholder="Ej: Algodón 100%"
                  className="border border-riviere-ink/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-riviere-ink placeholder:text-riviere-smoke/30"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <label htmlFor="caracteristicas" className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
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
              <label htmlFor="descripcion" className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
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
          </div>

          {/* Stock por variante */}
          <div className="border border-riviere-ink/10 bg-white p-6">
            <p className="mb-6 text-xs uppercase tracking-[0.24em] text-riviere-smoke">
              Stock por variante
            </p>

            {(() => {
              const colores = product.colores.length > 0 ? product.colores : [""];
              const variantMap = new Map(
                product.variantes.map((v) => [`${v.talla}|${v.color}`, v]),
              );
              return (
                <div className="overflow-hidden rounded-sm border border-riviere-ink/10">
                  <table className="w-full text-sm">
                    <thead className="bg-riviere-stone/40">
                      <tr className="text-xs uppercase tracking-[0.14em] text-riviere-smoke">
                        <th className="px-4 py-2.5 text-left">Talla</th>
                        {product.colores.length > 0 && (
                          <th className="px-4 py-2.5 text-left">Color</th>
                        )}
                        <th className="px-4 py-2.5 text-left">Ubicación</th>
                        <th className="px-4 py-2.5 text-right">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-riviere-ink/8">
                      {TALLA_ORDER.flatMap((talla) =>
                        colores.map((color) => {
                          const existing = variantMap.get(`${talla}|${color}`);
                          return (
                            <tr key={`${talla}|${color}`} className={existing ? "" : "opacity-40"}>
                              <td className="px-4 py-2 font-medium tracking-wide">
                                {talla}
                              </td>
                              {product.colores.length > 0 && (
                                <td className="px-4 py-2 text-riviere-smoke">
                                  {color}
                                </td>
                              )}
                              <td className="px-4 py-2">
                                <input
                                  name={`ubicacion-${talla}|${color}`}
                                  type="text"
                                  defaultValue={existing?.ubicacion ?? ""}
                                  placeholder="Ej: Caja 3-A"
                                  className="w-32 border border-riviere-ink/15 bg-transparent px-2 py-1 text-sm outline-none transition-colors focus:border-riviere-ink placeholder:text-riviere-smoke/30"
                                />
                              </td>
                              <td className="px-4 py-2 text-right">
                                <input
                                  name={`upsert-${talla}|${color}`}
                                  type="number"
                                  min="0"
                                  step="1"
                                  defaultValue={existing?.cantidad ?? 0}
                                  className="w-20 border border-riviere-ink/15 bg-transparent px-2 py-1 text-right text-sm outline-none transition-colors focus:border-riviere-ink"
                                />
                              </td>
                            </tr>
                          );
                        }),
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-riviere-smoke/50">
              Stock total: {stockTotal} unidades
            </p>
          </div>

          <div className="flex items-center gap-4">
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
