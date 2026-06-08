import Link from "next/link";

export const metadata = {
  title: "Envíos — RIVIERE",
};

export default function EnviosPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Envíos</span>
        </nav>

        <h1 className="mb-14 text-2xl font-light uppercase tracking-[0.22em]">
          Envíos
        </h1>

        <div className="max-w-2xl space-y-12">
          {/* Bogotá */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Bogotá D.C.
            </p>
            <h2 className="mb-4 text-base font-light uppercase tracking-[0.14em]">
              Envío gratis a domicilio
            </h2>
            <div className="space-y-3 text-sm leading-[1.8] text-riviere-smoke">
              <p>
                Los pedidos realizados con destino a Bogotá D.C. tienen envío
                sin costo adicional.
              </p>
              <p>
                Ofrecemos la opción de{" "}
                <strong className="font-medium text-riviere-ink">
                  pago contraentrega
                </strong>{" "}
                para compras en Bogotá. El pago se realiza directamente al
                mensajero por medio del QR Wompi al momento de recibir el
                producto.
              </p>
              <p>
                El tiempo estimado de entrega en Bogotá es de{" "}
                <strong className="font-medium text-riviere-ink">
                  1 a 3 días hábiles
                </strong>{" "}
                a partir de la confirmación del pedido.
              </p>
            </div>
          </section>

          {/* Resto del país */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Resto del país
            </p>
            <h2 className="mb-4 text-base font-light uppercase tracking-[0.14em]">
              Envío nacional — $15.000 COP
            </h2>
            <div className="space-y-3 text-sm leading-[1.8] text-riviere-smoke">
              <p>
                Para envíos fuera de Bogotá, el costo es de{" "}
                <strong className="font-medium text-riviere-ink">
                  $15.000 COP
                </strong>{" "}
                a cualquier ciudad del país.
              </p>
              <p>
                Los envíos nacionales se realizan a través de{" "}
                <strong className="font-medium text-riviere-ink">
                  Servientrega
                </strong>
                . Una vez despachado el pedido, recibirás el número de guía para
                hacer seguimiento en línea.
              </p>
              <p>
                El tiempo estimado de entrega fuera de Bogotá es de{" "}
                <strong className="font-medium text-riviere-ink">
                  3 a 6 días hábiles
                </strong>{" "}
                según la ciudad de destino.
              </p>
            </div>
          </section>

          {/* Consideraciones */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Consideraciones generales
            </p>
            <ul className="space-y-3 text-sm leading-[1.8] text-riviere-smoke">
              <li className="flex gap-3">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                Los tiempos de entrega son estimados y pueden variar según
                disponibilidad logística o días festivos.
              </li>
              <li className="flex gap-3">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                Verifica que la dirección de entrega sea correcta antes de
                confirmar el pedido.
              </li>
              <li className="flex gap-3">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                Si tienes dudas sobre tu pedido, escríbenos por WhatsApp o al
                correo riviere.co14@gmail.com.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
