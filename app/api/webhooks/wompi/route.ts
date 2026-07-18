import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from "@/src/lib/wompi";
import { finalizeCheckout } from "@/src/lib/order-fulfillment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.signature?.properties ||
      !body?.signature?.checksum ||
      typeof body?.timestamp !== "number"
    ) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    if (!validateWebhookSignature(body)) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    if (body.event === "transaction.updated") {
      const txn = body.data?.transaction;
      if (!txn?.reference) return NextResponse.json({ ok: true });

      const { reference, status, id: wompiTransactionId } = txn as {
        reference: string;
        status: string;
        id: string;
      };

      if (status === "APPROVED") {
        await finalizeCheckout(reference, "PAID", wompiTransactionId).catch(
          console.error,
        );
      } else if (
        status === "DECLINED" ||
        status === "ERROR" ||
        status === "VOIDED"
      ) {
        await finalizeCheckout(reference, "FAILED", wompiTransactionId).catch(
          console.error,
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhooks/wompi]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
