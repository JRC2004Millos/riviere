import { createHash, timingSafeEqual } from "crypto";

function wompiBaseUrl(): string {
  const key = process.env.WOMPI_PRIVATE_KEY ?? process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  return key.includes("_test_")
    ? "https://sandbox.wompi.co/v1"
    : "https://production.wompi.co/v1";
}

export type WompiTransaction = {
  id: string;
  reference: string;
  status: "APPROVED" | "DECLINED" | "ERROR" | "VOIDED" | "PENDING";
  amount_in_cents: number;
  currency: string;
};

export async function getWompiTransaction(
  wompiId: string,
): Promise<WompiTransaction | null> {
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  if (!privateKey) return null;

  try {
    const res = await fetch(`${wompiBaseUrl()}/transactions/${wompiId}`, {
      headers: { Authorization: `Bearer ${privateKey}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: WompiTransaction };
    return body.data ?? null;
  } catch {
    return null;
  }
}

export function generateIntegrityHash(
  reference: string,
  amountInCents: number,
  currency = "COP",
): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET!;
  const raw = `${reference}${amountInCents}${currency}${secret}`;
  return createHash("sha256").update(raw).digest("hex");
}

type WompiWebhookBody = {
  event: string;
  data: unknown;
  timestamp: number;
  signature: {
    properties: string[];
    checksum: string;
  };
};

function getNestedValue(obj: unknown, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[part];
  }
  return String(current ?? "");
}

export function validateWebhookSignature(body: WompiWebhookBody): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET!;
  const { properties, checksum } = body.signature;

  const values = properties.map((prop) => getNestedValue(body, prop));
  const raw = `${values.join("")}${body.timestamp}${secret}`;
  const computed = createHash("sha256").update(raw).digest("hex");

  if (computed.length !== checksum.length) return false;
  return timingSafeEqual(Buffer.from(computed), Buffer.from(checksum));
}
