import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { applyRandomDiscounts, resetAllDiscounts } from "@/src/lib/products-store";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      action?: "reset" | "apply";
      discount?: number;
      quantity?: number;
    };

    if (body.action === "reset") {
      const updated = await resetAllDiscounts();
      return NextResponse.json({ ok: true, updated });
    }

    if (body.action === "apply") {
      const discount = Number(body.discount);
      const quantity = Number(body.quantity);

      if (Number.isNaN(discount) || discount < 0 || discount > 100) {
        return NextResponse.json({ error: "Descuento inválido" }, { status: 400 });
      }

      if (Number.isNaN(quantity) || quantity <= 0) {
        return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 });
      }

      const result = await applyRandomDiscounts(discount, quantity);
      return NextResponse.json({ ok: true, ...result });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (err) {
    console.error("[admin/descuentos]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
