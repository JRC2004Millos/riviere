import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/src/lib/products-store";
import { getProductImage } from "@/src/lib/product-images";
import { Button } from "@/components/ui/button";
import { BulkDiscountControls } from "@/components/admin/bulk-discount-controls";

export const dynamic = "force-dynamic";

const fmt = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function AdminProductosPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const products = await getAllProducts();
  const disponibles = products.filter((p) => p.cantidad > 0).length;

  return (
    <main className="min-h-screen bg-riviere-bone pt-20 text-[#111]">
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.28em] text-riviere-smoke">
              Admin
            </p>
            <h1 className="text-2xl font-light uppercase tracking-[0.15em]">
              Productos - {disponibles}/{products.length} disponibles
            </h1>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
          >
            <Link href="/admin">← Dashboard</Link>
          </Button>
        </div>

        <div className="mb-6">
          <BulkDiscountControls productCount={products.length} />
        </div>

        <div className="overflow-x-auto border border-riviere-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-riviere-ink/10 text-xs uppercase tracking-[0.16em] text-riviere-smoke">
                <th className="px-4 py-3 text-left">Img</th>
                <th className="px-4 py-3 text-left">Estilo</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-left">Color</th>
                <th className="px-4 py-3 text-left">Tallas</th>
                <th className="px-4 py-3 text-right">Cant.</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-riviere-ink/5">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-riviere-bone/40"
                >
                  <td className="px-4 py-2.5">
                    {p.hasImage ? (
                      <div className="relative h-10 w-8 shrink-0 overflow-hidden bg-riviere-stone">
                        <Image
                          src={getProductImage(p.estilo)}
                          alt={p.estilo}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-8 bg-riviere-stone/50" />
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-medium tracking-wide">
                    {p.estilo}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmt.format(p.precio)}
                  </td>
                  <td className="px-4 py-2.5 text-riviere-smoke">
                    {p.colores.length > 0 ? p.colores[0] : "—"}
                    {p.colores.length > 1 ? ` +${p.colores.length - 1}` : ""}
                  </td>
                  <td className="px-4 py-2.5 text-riviere-smoke">
                    {p.tallas.slice(0, 3).join(", ")}
                    {p.tallas.length > 3 ? "…" : ""}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {p.cantidad}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-xs font-medium uppercase tracking-[0.12em] ${
                        p.cantidad > 0
                          ? "text-emerald-700"
                          : "text-riviere-smoke/60"
                      }`}
                    >
                      {p.cantidad > 0 ? "Disponible" : "Agotado"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button asChild variant="ghost" size="sm" className="h-7 px-3 text-xs">
                      <Link href={`/admin/productos/${p.estilo}`}>Editar</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
