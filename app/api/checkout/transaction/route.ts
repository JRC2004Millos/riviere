import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getWompiTransaction } from "@/src/lib/wompi";
import { finalizeCheckout } from "@/src/lib/order-fulfillment";
import { getCheckoutIntent } from "@/src/lib/checkout-intents";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const wompiId = req.nextUrl.searchParams.get("id");
  if (!wompiId) {
    return NextResponse.json({ error: "id requerido" }, { status: 400 });
  }

  // 1. Si el webhook ya procesó la orden, devolver directo
  const byTxnId = await prisma.order.findFirst({
    where: { wompiTransactionId: wompiId },
    select: { reference: true, status: true, total: true },
  });
  if (byTxnId) return NextResponse.json(byTxnId);

  // 2. Consultar Wompi para obtener referencia y estado real
  const txn = await getWompiTransaction(wompiId);
  if (!txn) {
    return NextResponse.json(
      { error: "Transacción no encontrada en Wompi" },
      { status: 404 },
    );
  }

  // 3. Buscar la orden por referencia
  const order = await prisma.order.findUnique({
    where: { reference: txn.reference },
    select: { reference: true, status: true, total: true },
  });
  if (!order) {
    const intent = await getCheckoutIntent(txn.reference);
    if (!intent || !intent.payload || typeof intent.payload !== "object") {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    const payload = intent.payload as {
      total?: number;
    };

    if (txn.status === "APPROVED") {
      await finalizeCheckout(txn.reference, "PAID", wompiId);
      return NextResponse.json({
        reference: txn.reference,
        status: "PAID",
        total: payload.total ?? 0,
      });
    }

    if (
      txn.status === "DECLINED" ||
      txn.status === "ERROR" ||
      txn.status === "VOIDED"
    ) {
      await finalizeCheckout(txn.reference, "FAILED", wompiId);
      return NextResponse.json({
        reference: txn.reference,
        status: "FAILED",
        total: payload.total ?? 0,
      });
    }

    return NextResponse.json({
      reference: txn.reference,
      status: "PENDING_PAYMENT",
      total: payload.total ?? 0,
    });
  }

  // 4. Procesar si aún está pendiente (actualiza estado + stock + envía correo)
  if (order.status === "PENDING_PAYMENT") {
    const newStatus =
      txn.status === "APPROVED"
        ? "PAID"
        : txn.status === "DECLINED" ||
            txn.status === "ERROR" ||
            txn.status === "VOIDED"
          ? "FAILED"
          : null;

    if (newStatus) {
      await finalizeCheckout(txn.reference, newStatus, wompiId);
      return NextResponse.json({
        reference: order.reference,
        status: newStatus,
        total: order.total,
      });
    }
  }

  return NextResponse.json(order);
}
