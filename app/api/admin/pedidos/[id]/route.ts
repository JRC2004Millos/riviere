import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = (await req.json()) as { action?: "deliver" | "cancel" };

    if (!body.action || !["deliver", "cancel"].includes(body.action)) {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    const status = body.action === "deliver" ? "PAID" : "CANCELLED";

    const result = await prisma.order.updateMany({
      where: { id, status: "PENDING_PAYMENT" },
      data: { status },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/pedidos]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
