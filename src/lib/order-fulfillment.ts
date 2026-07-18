import { prisma } from "./prisma";
import { sendOrderConfirmedEmail, sendOrderFailedEmail } from "./email";
import { getCheckoutIntent, markCheckoutIntent } from "./checkout-intents";

type FulfillStatus = "updated" | "already_processed" | "not_found";

export async function fulfillOrder(
  reference: string,
  newStatus: "PAID" | "FAILED",
  wompiTransactionId?: string,
): Promise<FulfillStatus> {
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });

  if (!order) return "not_found";

  const result = await prisma.order.updateMany({
    where: { reference, status: "PENDING_PAYMENT" },
    data: {
      status: newStatus,
      ...(wompiTransactionId ? { wompiTransactionId } : {}),
    },
  });

  if (result.count === 0) return "already_processed";

  if (newStatus === "PAID") {
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
      await prisma.$transaction(stockOps);
    } catch (err) {
      console.error("[fulfillOrder] stock update failed:", err);
    }

    try {
      await sendOrderConfirmedEmail({
        reference: order.reference,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerCity: order.customerCity,
        customerDepartment: order.customerDepartment,
        customerAddress: order.customerAddress,
        total: order.total,
        envio: order.envio,
        items: order.items,
        createdAt: order.createdAt,
      });
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
        customerDepartment: order.customerDepartment,
        customerAddress: order.customerAddress,
        total: order.total,
        envio: order.envio,
        items: order.items,
      });
    } catch (err) {
      console.error("[fulfillOrder] email (failed) failed:", err);
    }
  }

  return "updated";
}

export async function finalizeCheckout(
  reference: string,
  newStatus: "PAID" | "FAILED",
  wompiTransactionId?: string,
): Promise<FulfillStatus> {
  const intent = await getCheckoutIntent(reference);
  if (!intent) {
    const existing = await prisma.order.findUnique({
      where: { reference },
      select: { id: true },
    });
    return existing ? "already_processed" : "not_found";
  }

  if (newStatus === "FAILED") {
    await markCheckoutIntent(reference, {
      status: "FAILED",
      wompiTransactionId,
    });
    return "updated";
  }

  const consumed = await prisma.checkoutIntent.updateMany({
    where: { reference, consumedAt: null, status: "PENDING" },
    data: {
      status: "PAID",
      consumedAt: new Date(),
      ...(wompiTransactionId ? { wompiTransactionId } : {}),
    },
  });

  if (consumed.count === 0) {
    const existing = await prisma.order.findUnique({
      where: { reference },
      select: { id: true },
    });
    return existing ? "already_processed" : "not_found";
  }

  const payload = intent.payload as {
    items: Array<{
      productId: string;
      estilo: string;
      nombre: string;
      talla: string;
      color: string;
      precio: number;
      cantidad: number;
    }>;
    customer: {
      nombre: string;
      email: string;
      telefono: string;
      ciudad: string;
      departamento: string;
      direccion: string;
    };
    total: number;
    envio: number;
  };

  const orderExists = await prisma.order.findUnique({ where: { reference } });
  if (orderExists) return "already_processed";

  await prisma.order.create({
    data: {
      reference,
      status: "PAID",
      total: payload.total,
      envio: payload.envio,
      customerName: payload.customer.nombre,
      customerEmail: payload.customer.email,
      customerPhone: payload.customer.telefono,
      customerCity: payload.customer.ciudad,
      customerDepartment: payload.customer.departamento,
      customerAddress: payload.customer.direccion,
      wompiTransactionId,
      items: {
        create: payload.items,
      },
    },
  });

  return "updated";
}
