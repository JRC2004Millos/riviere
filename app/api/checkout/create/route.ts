import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { generateIntegrityHash } from "@/src/lib/wompi";

type CheckoutItem = {
  productId: string;
  talla: string;
  color?: string;
  cantidad: number;
};

type CheckoutCustomer = {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items: CheckoutItem[];
      customer: CheckoutCustomer;
    };

    const { items, customer } = body;

    if (!items?.length || !customer?.nombre?.trim() || !customer?.email?.trim()) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.productId || !item.talla || item.cantidad < 1) {
        return NextResponse.json({ error: "Item inválido en el pedido" }, { status: 400 });
      }
    }

    // Fetch products + variants from DB — backend es la única fuente de precios y stock
    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variantes: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    const orderItems: {
      productId: string;
      estilo: string;
      nombre: string;
      talla: string;
      color: string;
      precio: number;
      cantidad: number;
    }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: "Producto no encontrado" }, { status: 400 });
      }

      const color = item.color ?? "";

      // Busca la variante exacta (talla + color)
      const variante = product.variantes.find(
        (v) => v.talla === item.talla && v.color === color,
      );

      if (!variante) {
        return NextResponse.json(
          { error: `Talla ${item.talla} no disponible para ${product.nombre || product.estilo}` },
          { status: 400 },
        );
      }

      if (variante.cantidad < item.cantidad) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.nombre || product.estilo} — talla ${item.talla}` },
          { status: 400 },
        );
      }

      total += product.precio * item.cantidad;
      orderItems.push({
        productId: product.id,
        estilo: product.estilo,
        nombre: product.nombre || product.estilo,
        talla: item.talla,
        color,
        precio: product.precio,
        cantidad: item.cantidad,
      });
    }

    const reference = `RIVIERE-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    await prisma.order.create({
      data: {
        reference,
        total,
        customerName: customer.nombre.trim(),
        customerEmail: customer.email.trim().toLowerCase(),
        customerPhone: customer.telefono?.trim() ?? "",
        customerAddress: customer.direccion?.trim() ?? "",
        items: { create: orderItems },
      },
    });

    const amountInCents = total * 100;
    const integrityHash = generateIntegrityHash(reference, amountInCents);

    const origin =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const redirectUrl = `${origin}/checkout/resultado?ref=${reference}`;

    const wompiParams = new URLSearchParams({
      "public-key": process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY!,
      currency: "COP",
      "amount-in-cents": String(amountInCents),
      reference,
      "redirect-url": redirectUrl,
      "signature:integrity": integrityHash,
    });

    return NextResponse.json({ wompiUrl: `https://checkout.wompi.co/p/?${wompiParams}` });
  } catch (err) {
    console.error("[checkout/create]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
