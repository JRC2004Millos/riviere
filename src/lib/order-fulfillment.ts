import { prisma } from "./prisma";
import { sendOrderConfirmedEmail, sendOrderFailedEmail } from "./email";

type FulfillStatus = "updated" | "already_processed" | "not_found";

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
    const outcome = exists ? "already_processed" : "not_found";
    console.log(`[fulfillOrder] ${reference} → ${outcome}`);
    return outcome;
  }

  console.log(`[fulfillOrder] ${reference} → ${newStatus}`);

  // Obtener orden completa con items
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  if (!order) return "not_found";

  console.log(`[fulfillOrder] ${reference} items: ${order.items.length}`);

  if (newStatus === "PAID") {
    // Descontar stock de cada variante
    try {
      const stockOps = order.items.map((item) =>
        prisma.productVariant.updateMany({
          where: {
            productId: item.productId,
            talla: item.talla,
            color: item.color,
            cantidad: { gte: item.cantidad },
          },
          data: { cantidad: { decrement: item.cantidad } },
        }),
      );
      const results = await prisma.$transaction(stockOps);
      console.log(
        `[fulfillOrder] stock updated: ${results.map((r) => r.count).join(",")}`,
      );
    } catch (err) {
      console.error("[fulfillOrder] stock update failed:", err);
    }

    try {
      await sendOrderConfirmedEmail({
        reference: order.reference,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerCity: order.customerCity,
        total: order.total,
        envio: order.envio,
        items: order.items,
      });
      console.log(`[fulfillOrder] confirmation email sent to ${order.customerEmail}`);
    } catch (err) {
      console.error("[fulfillOrder] email (confirmed) failed:", err);
    }
  } else {
    try {
      await sendOrderFailedEmail({
        reference: order.reference,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerCity: order.customerCity,
        total: order.total,
        envio: order.envio,
        items: order.items,
      });
      console.log(`[fulfillOrder] rejection email sent to ${order.customerEmail}`);
    } catch (err) {
      console.error("[fulfillOrder] email (failed) failed:", err);
    }
  }

  return "updated";
}
