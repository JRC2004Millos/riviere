import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { generateIntegrityHash } from "@/src/lib/wompi";
import { saveCheckoutIntent } from "@/src/lib/checkout-intents";
import path from "path";
import fs from "fs";

const COSTO_ENVIO = 15_000;

function getDepartamentoNombre(id: string): string {
  try {
    const file = path.join(process.cwd(), "data", "colombia.min.txt");
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as Array<{ id: number; departamento: string }>;
    const found = data.find((d) => String(d.id) === id);
    return found?.departamento ?? id;
  } catch {
    return id;
  }
}

function precioConDcto(precio: number, dcto: number | null): number {
  if (!dcto) return precio;
  return Math.round(precio * (1 - dcto / 100));
}

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
  ciudad: string;
  departamentoId?: string;
  direccion: string;
  detallesDir?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items: CheckoutItem[];
      customer: CheckoutCustomer;
    };

    const { items, customer } = body;

    if (
      !items?.length ||
      !customer?.nombre?.trim() ||
      !customer?.email?.trim() ||
      !customer?.ciudad?.trim() ||
      !customer?.direccion?.trim()
    ) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Validación básica de dirección colombiana
    const ADDR_RE =
      /^(calle|carrera|cra\.?|cll\.?|avenida|av\.?|transversal|tv\.?|diagonal|dg\.?|autopista|ak\.?)\s+\d/i;
    if (!ADDR_RE.test(customer.direccion.trim())) {
      return NextResponse.json(
        { error: "Formato de dirección inválido" },
        { status: 400 },
      );
    }

    for (const item of items) {
      if (!item.productId || !item.talla || item.cantidad < 1) {
        return NextResponse.json(
          { error: "Item inválido en el pedido" },
          { status: 400 },
        );
      }
    }

    // Fetch products + variants from DB — backend es la única fuente de precios y stock
    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variantes: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
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
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 400 },
        );
      }

      const color = item.color ?? "";

      const variante = product.variantes.find(
        (v) => v.talla === item.talla && v.color === color,
      );

      if (!variante) {
        return NextResponse.json(
          {
            error: `Talla ${item.talla} no disponible para ${product.nombre || product.estilo}`,
          },
          { status: 400 },
        );
      }

      if (variante.cantidad < item.cantidad) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para ${product.nombre || product.estilo} — talla ${item.talla}`,
          },
          { status: 400 },
        );
      }

      const precioFinal = precioConDcto(product.precio, product.dcto);
      subtotal += precioFinal * item.cantidad;
      orderItems.push({
        productId: product.id,
        estilo: product.estilo,
        nombre: product.nombre || product.estilo,
        talla: item.talla,
        color,
        precio: precioFinal,
        cantidad: item.cantidad,
      });
    }

    // Costo de envío: gratis en Bogotá, $15.000 en el resto del país
    const ciudad = customer.ciudad.trim();
    const envio = ciudad.toLowerCase().includes("bogot") ? 0 : COSTO_ENVIO;
    const total = subtotal + envio;

    const reference = `RIVIERE-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    await saveCheckoutIntent(reference, {
      items: orderItems,
      customer: {
        nombre: customer.nombre.trim(),
        email: customer.email.trim().toLowerCase(),
        telefono: customer.telefono?.trim() ?? "",
        ciudad,
        departamento: customer.departamentoId
          ? getDepartamentoNombre(customer.departamentoId)
          : "",
        direccion: customer.detallesDir?.trim()
          ? `${customer.direccion.trim()}, ${customer.detallesDir.trim()}`
          : customer.direccion.trim(),
      },
      total,
      envio,
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

    return NextResponse.json({
      wompiUrl: `https://checkout.wompi.co/p/?${wompiParams}`,
    });
  } catch (err) {
    console.error("[checkout/create]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
