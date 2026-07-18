import { prisma } from "./prisma";

type IntentPayload = {
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

export async function saveCheckoutIntent(reference: string, payload: IntentPayload) {
  await prisma.checkoutIntent.upsert({
    where: { reference },
    create: {
      reference,
      payload,
      status: "PENDING",
    },
    update: {
      payload,
      status: "PENDING",
      consumedAt: null,
    },
  });
}

export async function markCheckoutIntent(reference: string, data: Partial<{ status: string; wompiTransactionId: string }>) {
  await prisma.checkoutIntent.updateMany({
    where: { reference },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.wompiTransactionId ? { wompiTransactionId: data.wompiTransactionId } : {}),
      ...(data.status ? { consumedAt: new Date() } : {}),
    },
  });
}

export async function getCheckoutIntent(reference: string) {
  return prisma.checkoutIntent.findUnique({ where: { reference } });
}
