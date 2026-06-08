import { createHash, timingSafeEqual } from "crypto";

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
