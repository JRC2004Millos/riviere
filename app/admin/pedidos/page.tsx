import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { PedidoActions } from "@/components/admin/pedido-actions";

export const dynamic = "force-dynamic";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const DATE_FMT = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Bogota",
});

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente",
  PAID: "Entregado",
  FAILED: "Fallido",
  CANCELLED: "Cancelado",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-600 border-red-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

export default async function AdminPedidosPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  // Fetch variant ubicaciones for all items in one query
  const allProductIds = [...new Set(orders.flatMap((o) => o.items.map((i) => i.productId)))];
  const variants =
    allProductIds.length > 0
      ? await prisma.productVariant.findMany({
          where: { productId: { in: allProductIds } },
          select: { productId: true, talla: true, color: true, ubicacion: true },
        })
      : [];
  const ubicacionMap = new Map(
    variants.map((v) => [`${v.productId}:${v.talla}:${v.color}`, v.ubicacion]),
  );

  const paid = orders.filter((o) => o.status === "PAID").length;
  const pending = orders.filter((o) => o.status === "PENDING_PAYMENT").length;

  return (
    <main className="min-h-screen bg-riviere-bone pt-20 text-[#111]">
      <div className="container max-w-4xl py-10">
        <nav className="mb-8 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/admin" className="transition-colors hover:text-riviere-ink">
            Admin
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Pedidos</span>
        </nav>

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light uppercase tracking-[0.18em]">Pedidos</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-riviere-smoke">
              {orders.length} total · {paid} pagados · {pending} pendientes
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="border border-riviere-ink/10 bg-white px-8 py-16 text-center">
            <p className="text-sm uppercase tracking-[0.18em] text-riviere-smoke">
              Sin pedidos aún
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-riviere-ink/10 bg-white"
              >
                {/* Cabecera del pedido */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-riviere-ink/8 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${STATUS_STYLE[order.status] ?? STATUS_STYLE.CANCELLED}`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <span className="font-mono text-xs text-riviere-smoke">
                      {order.reference}
                    </span>
                  </div>
                  <span className="text-xs text-riviere-smoke">
                    {DATE_FMT.format(order.createdAt)}
                  </span>
                </div>

                <div className="grid gap-6 px-6 py-5 sm:grid-cols-2">
                  {/* Cliente */}
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-riviere-smoke">
                      Cliente
                    </p>
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="mt-0.5 text-xs text-riviere-smoke">{order.customerEmail}</p>
                    {order.customerPhone && (
                      <p className="mt-0.5 text-xs text-riviere-smoke">{order.customerPhone}</p>
                    )}
                  </div>

                  {/* Dirección */}
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-riviere-smoke">
                      Dirección de entrega
                    </p>
                    {order.customerAddress ? (
                      <>
                        <p className="text-sm">{order.customerAddress}</p>
                        <p className="mt-0.5 text-xs text-riviere-smoke">
                          {[order.customerCity, order.customerDepartment]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-riviere-smoke/50">Sin dirección</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-riviere-ink/8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-riviere-stone/30">
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-riviere-smoke">
                          Producto
                        </th>
                        <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-riviere-smoke">
                          Código
                        </th>
                        <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-riviere-smoke">
                          Talla
                        </th>
                        <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-riviere-smoke">
                          Ubicación
                        </th>
                        <th className="px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-riviere-smoke">
                          Cant.
                        </th>
                        <th className="px-6 py-2.5 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-riviere-smoke">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-riviere-ink/6">
                      {order.items.map((item) => {
                        const ubicacion =
                          ubicacionMap.get(
                            `${item.productId}:${item.talla}:${item.color}`,
                          ) ?? "";
                        return (
                        <tr key={item.id}>
                          <td className="px-6 py-3 text-sm">
                            {item.nombre || item.estilo}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs uppercase text-riviere-smoke">
                            {item.estilo}
                          </td>
                          <td className="px-4 py-3 text-xs text-riviere-smoke">
                            {item.talla}
                            {item.color ? ` · ${item.color}` : ""}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-riviere-smoke">
                            {ubicacion || <span className="opacity-30">—</span>}
                          </td>
                          <td className="px-4 py-3 text-center text-xs">
                            {item.cantidad}
                          </td>
                          <td className="px-6 py-3 text-right text-xs">
                            {COP.format(item.precio * item.cantidad)}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="border-t border-riviere-ink/10">
                      {order.envio > 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-2 text-right text-[10px] uppercase tracking-[0.12em] text-riviere-smoke"
                          >
                            Envío
                          </td>
                          <td className="px-6 py-2 text-right text-xs">
                            {COP.format(order.envio)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-riviere-smoke"
                        >
                          Total
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-medium">
                          {COP.format(order.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {order.status === "PENDING_PAYMENT" && (
                  <div className="px-6 pb-5">
                    <PedidoActions orderId={order.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
