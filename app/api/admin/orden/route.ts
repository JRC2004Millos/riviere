import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveSortOrder } from "@/src/lib/products-store";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { ids: string[] };

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json({ error: "ids requerido" }, { status: 400 });
    }

    await saveSortOrder(body.ids);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/orden]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
