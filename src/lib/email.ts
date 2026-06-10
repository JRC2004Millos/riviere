import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "RIVIERE <onboarding@resend.dev>";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://riviere-mu.vercel.app";

// ── Configuración comercial ────────────────────────────────────────────────
// TODO: reemplazar con razón social y NIT reales antes de producción
const SELLER_NAME = "Alejandro Rodríguez González";
const SELLER_NIT = "1014977928";
const STORE_EMAIL = "riviere.co14@gmail.com";
const STORE_PHONE = "+57 301 1258495";
const RETURNS_URL = "https://riviere-co.com/garantia";
// ──────────────────────────────────────────────────────────────────────────

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const DATE_FMT = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Bogota",
});

export type EmailOrderItem = {
  estilo: string;
  nombre: string;
  talla: string;
  color: string;
  cantidad: number;
  precio: number;
};

export type EmailOrder = {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerCity?: string;
  customerDepartment?: string;
  customerAddress?: string;
  total: number;
  envio: number;
  items: EmailOrderItem[];
  createdAt?: Date;
};

// ── Bloques de contenido ──────────────────────────────────────────────────

function purchaseInfoBlock(order: EmailOrder): string {
  const fecha = order.createdAt ? DATE_FMT.format(order.createdAt) : "—";
  return `
    <table style="width:100%;border-collapse:collapse;margin:0 0 28px">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#999;width:40%">Fecha de compra</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333">${fecha}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#999">Medio de pago</td>
        <td style="padding:10px 0;font-size:13px;color:#333">Tarjeta de crédito/débito o PSE, procesado por Wompi</td>
      </tr>
    </table>`;
}

function addressBlock(order: EmailOrder): string {
  const { customerAddress, customerCity, customerDepartment } = order;
  if (!customerAddress && !customerCity) return "";
  const lines = [
    customerAddress,
    [customerCity, customerDepartment].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .map((l) => `<p style="margin:3px 0 0;font-size:14px;color:#333">${l}</p>`)
    .join("");
  return `
    <div style="margin:0 0 28px;padding:14px 16px;background:#f7f7f7;border-left:3px solid #ddd">
      <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:#999">Dirección de entrega</p>
      ${lines}
    </div>`;
}

function itemsTable(order: EmailOrder): string {
  const { items, envio, total } = order;
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0">
        <span style="display:block;font-size:14px">${item.nombre || item.estilo}</span>
        <span style="display:block;font-size:11px;color:#aaa;letter-spacing:.08em;text-transform:uppercase;margin-top:2px">${item.estilo}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555">
        ${item.talla}${item.color ? ` · ${item.color}` : ""}
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:center">
        ${item.cantidad}
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:right">
        ${COP.format(item.precio * item.cantidad)}
      </td>
    </tr>`,
    )
    .join("");

  const envioRow =
    envio > 0
      ? `<tr>
          <td colspan="3" style="padding:10px 14px;text-align:right;font-size:12px;color:#888">Envío</td>
          <td style="padding:10px 14px;text-align:right;font-size:13px">${COP.format(envio)}</td>
        </tr>`
      : `<tr>
          <td colspan="3" style="padding:10px 14px;text-align:right;font-size:12px;color:#888">Envío</td>
          <td style="padding:10px 14px;text-align:right;font-size:13px;color:#888">Gratis</td>
        </tr>`;

  return `
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#f7f7f7">
          <th style="padding:8px 14px;text-align:left;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:#888">Producto</th>
          <th style="padding:8px 14px;text-align:left;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:#888">Talla</th>
          <th style="padding:8px 14px;text-align:center;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:#888">Cant.</th>
          <th style="padding:8px 14px;text-align:right;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:#888">Valor</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        ${envioRow}
        <tr>
          <td colspan="3" style="padding:12px 14px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#888;border-top:1px solid #f0f0f0">Total</td>
          <td style="padding:12px 14px;text-align:right;font-size:15px;font-weight:600;border-top:1px solid #f0f0f0">${COP.format(total)}</td>
        </tr>
      </tfoot>
    </table>`;
}

function deliveryBlock(order: EmailOrder): string {
  const esBogota = (order.customerCity ?? "").toLowerCase().includes("bogot");
  const highlight = esBogota
    ? "Bogotá: <strong>1 a 3 días hábiles</strong>"
    : `${order.customerCity ?? "Tu ciudad"}: <strong>3 a 6 días hábiles</strong>`;

  return `
    <div style="margin:28px 0 0;padding:16px 18px;border:1px solid #ebebeb">
      <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:#999">Tiempo estimado de entrega</p>
      <p style="margin:0 0 4px;font-size:14px;color:#333">${highlight}</p>
      <p style="margin:6px 0 0;font-size:12px;color:#aaa;line-height:1.6">
        Los tiempos se cuentan a partir del despacho del pedido, una vez confirmado el pago.
        Bogotá: 1–3 días hábiles · Resto del país: 3–6 días hábiles.
      </p>
    </div>`;
}

function legalSection(): string {
  return `
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f0f0f0">

      <!-- Contacto -->
      <p style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:#bbb">Contacto</p>
      <p style="margin:0 0 24px;font-size:12px;color:#888;line-height:1.7">
        ${STORE_EMAIL} &nbsp;·&nbsp; ${STORE_PHONE}
      </p>

      <!-- Vendedor -->
      <p style="margin:0 0 6px;font-size:11px;color:#bbb">
        <strong style="color:#aaa;font-weight:500">Vendedor:</strong> ${SELLER_NAME} &nbsp;·&nbsp;
        <strong style="color:#aaa;font-weight:500">NIT:</strong> ${SELLER_NIT}
      </p>

      <!-- Política de cambios -->
      <p style="margin:0 0 24px;font-size:11px;color:#bbb">
        <strong style="color:#aaa;font-weight:500">Cambios y devoluciones:</strong>
        <a href="${RETURNS_URL}" style="color:#888;text-decoration:underline">${RETURNS_URL}</a>
      </p>

      <!-- Derecho de retracto -->
      <div style="padding:14px 16px;background:#f9f9f9;border-left:2px solid #ddd">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#bbb">Derecho de retracto — Ley 1480 de 2011</p>
        <p style="margin:0;font-size:11px;color:#aaa;line-height:1.7">
          De acuerdo con el Estatuto del Consumidor colombiano, tienes derecho a retractarte
          de esta compra dentro de los <strong style="color:#888">5 días hábiles</strong> siguientes
          a la recepción del producto, siempre que no haya sido usado ni alterado.
          Para ejercer este derecho, escríbenos a
          <a href="mailto:${STORE_EMAIL}" style="color:#888">${STORE_EMAIL}</a>
          con el asunto <em>"Retracto – ${"{referencia}"}"</em> e indica el motivo.
          Los gastos de envío de la devolución corren por cuenta del comprador,
          salvo que el producto presente un defecto de fábrica.
        </p>
      </div>

    </div>`;
}

function layout(content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;color:#111">
  <div style="max-width:600px;margin:40px auto;background:#fff;padding:48px 40px">
    <p style="margin:0 0 36px;font-size:11px;text-transform:uppercase;letter-spacing:.3em;color:#888">RIVIERE</p>
    ${content}
    <hr style="border:none;border-top:1px solid #f0f0f0;margin:40px 0 20px">
    <p style="margin:0;font-size:10px;color:#ccc;text-align:center;letter-spacing:.1em">
      RIVIERE — Camisas masculinas premium
    </p>
  </div>
</body></html>`;
}

function resolveRecipient(customerEmail: string): string {
  return process.env.RESEND_TO_OVERRIDE?.trim() || customerEmail;
}

const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL?.trim() ?? "";

// ── Emails ────────────────────────────────────────────────────────────────

export async function sendOrderConfirmedEmail(
  order: EmailOrder,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:300;letter-spacing:.15em;text-transform:uppercase">
      Pedido confirmado
    </h1>
    <p style="margin:0 0 32px;font-size:12px;color:#888;letter-spacing:.1em">
      Ref. ${order.reference}
    </p>

    <p style="margin:0 0 28px;font-size:15px;line-height:1.7">
      Hola ${order.customerName}, tu pago fue recibido exitosamente.
      Pronto nos pondremos en contacto contigo para coordinar la entrega.
    </p>

    ${purchaseInfoBlock(order)}
    ${addressBlock(order)}
    ${itemsTable(order)}
    ${deliveryBlock(order)}
    ${legalSection()}
  `);

  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(order.customerEmail),
    replyTo: STORE_EMAIL,
    subject: `Pedido confirmado — Ref. ${order.reference}`,
    html,
  });

  if (ADMIN_EMAIL) {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `[Nuevo pedido] ${order.customerName} — Ref. ${order.reference}`,
      html,
    });
  }
}

export async function sendOrderFailedEmail(order: EmailOrder): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:300;letter-spacing:.15em;text-transform:uppercase">
      Pago no completado
    </h1>
    <p style="margin:0 0 32px;font-size:12px;color:#888;letter-spacing:.1em">
      Ref. ${order.reference}
    </p>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.7">
      Hola ${order.customerName}, tu pago no pudo ser procesado.
      Puedes intentarlo de nuevo cuando quieras.
    </p>
    ${addressBlock(order)}
    ${itemsTable(order)}
    <div style="margin-top:36px;text-align:center">
      <a href="${APP_URL}/catalogo"
         style="display:inline-block;padding:14px 32px;background:#111;color:#fff;text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase">
        Volver a la tienda
      </a>
    </div>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #f0f0f0;font-size:11px;color:#bbb;text-align:center">
      ${STORE_EMAIL} &nbsp;·&nbsp; ${STORE_PHONE}
    </div>
  `);

  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(order.customerEmail),
    replyTo: STORE_EMAIL,
    subject: `Pago no completado — Ref. ${order.reference}`,
    html,
  });
}
