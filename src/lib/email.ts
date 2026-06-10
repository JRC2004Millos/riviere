import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_FROM_EMAIL ?? "RIVIERE <onboarding@resend.dev>";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://riviere-mu.vercel.app";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
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
  total: number;
  envio: number;
  items: EmailOrderItem[];
};

function itemsTable(order: EmailOrder): string {
  const { items, envio, total } = order;
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px">
        ${item.nombre || item.estilo}
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

function layout(content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;color:#111">
  <div style="max-width:600px;margin:40px auto;background:#fff;padding:48px 40px">
    <p style="margin:0 0 36px;font-size:11px;text-transform:uppercase;letter-spacing:.3em;color:#888">RIVIERE</p>
    ${content}
    <hr style="border:none;border-top:1px solid #f0f0f0;margin:40px 0 24px">
    <p style="margin:0;font-size:11px;color:#bbb;text-align:center">
      RIVIERE — Camisas masculinas premium
    </p>
  </div>
</body></html>`;
}

// Cuando se usa onboarding@resend.dev solo puedes enviar al email de tu cuenta Resend.
// Setea RESEND_TO_OVERRIDE con ese email para pruebas. En producción con dominio
// verificado, quita esta variable y los correos van al email real del cliente.
function resolveRecipient(customerEmail: string): string {
  return process.env.RESEND_TO_OVERRIDE?.trim() || customerEmail;
}

export async function sendOrderConfirmedEmail(order: EmailOrder): Promise<void> {
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
    ${itemsTable(order)}
  `);

  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(order.customerEmail),
    replyTo: order.customerEmail,
    subject: `Pedido confirmado — Ref. ${order.reference}`,
    html,
  });
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
    <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#888">
      Productos en tu pedido
    </p>
    ${itemsTable(order)}
    <div style="margin-top:36px;text-align:center">
      <a href="${APP_URL}/catalogo"
         style="display:inline-block;padding:14px 32px;background:#111;color:#fff;text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase">
        Volver a la tienda
      </a>
    </div>
  `);

  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(order.customerEmail),
    replyTo: order.customerEmail,
    subject: `Pago no completado — Ref. ${order.reference}`,
    html,
  });
}
