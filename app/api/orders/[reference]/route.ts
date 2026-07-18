import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getCheckoutIntent } from "@/src/lib/checkout-intents";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;

  const order = await prisma.order.findUnique({
    where: { reference },
    select: { reference: true, status: true, total: true },
  });

  if (!order) {
    const intent = await getCheckoutIntent(reference);
    if (!intent || !intent.payload || typeof intent.payload !== "object") {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    const payload = intent.payload as {
      total?: number;
    };

    return NextResponse.json({
      reference,
      status: intent.status === "FAILED" ? "FAILED" : "PENDING_PAYMENT",
      total: payload.total ?? 0,
    });
  }

  return NextResponse.json(order);
}
