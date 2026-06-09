import { prisma } from "./prisma";
import { sendOrderConfirmedEmail, sendOrderFailedEmail } from "./email";

type FulfillStatus = "updated" | "already_processed" | "not_found";

/**
 * Procesa el resultado de un pago de forma idempotente:
 * - Solo actúa si la orden está en PENDING_PAYMENT (evita doble procesamiento).
 * - Si es PAID: descuenta stock y envía correo de confirmación.
 * - Si es FAILED: envía correo de rechazo.
 */
export async function fulfillOrder(
  reference: string,
  newStatus: "PAID" | "FAILED",
  wompiTransactionId?: string,
): Promise<FulfillStatus> {
  // Actualización atómica: solo procesa si sigue pendiente
  const result = await prisma.order.updateMany({
    where: { reference, status: "PENDING_PAYMENT" },
    data: {
      status: newStatus,
      ...(wompiTransactionId ? { wompiTransactionId } : {}),
    },
  });

  if (result.count === 0) {
    const exists = await prisma.order.findUnique({
      where: { reference },
      select: { id: true },
    });
    return exists ? "already_processed" : "not_found";
  }

  // Obtener orden completa para correo y actualización de stock
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  if (!order) return "not_found";

  if (newStatus === "PAID") {
    // Descontar stock de cada variante
    await prisma
      .$transaction(
        order.items.map((item) =>
          prisma.productVariant.updateMany({
            where: {
              productId: item.productId,
              talla: item.talla,
              color: item.color,
              cantidad: { gte: item.cantidad },
            },
            data: { cantidad: { decrement: item.cantidad } },
          }),
        ),
      )
      .catch(console.error);

    await sendOrderConfirmedEmail({
      reference: order.reference,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      items: order.items,
    }).catch(console.error);
  } else {
    await sendOrderFailedEmail({
      reference: order.reference,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      items: order.items,
    }).catch(console.error);
  }

  return "updated";
}
