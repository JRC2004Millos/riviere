import Link from "next/link";

export const metadata = {
  title: "Política de Cambios — RIVIERE",
};

export default function CambiosPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Política de Cambios</span>
        </nav>

        <h1 className="mb-14 text-2xl font-light uppercase tracking-[0.22em]">
          Política de Cambios
        </h1>

        <div className="max-w-2xl space-y-12">
          {/* Naturaleza del cambio */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Naturaleza del cambio
            </p>
            <p className="text-sm leading-[1.9] text-riviere-smoke">
              Los cambios por talla o referencia constituyen una{" "}
              <strong className="font-medium text-riviere-ink">
                cortesía comercial
              </strong>{" "}
              ofrecida por RIVIERE y no una obligación legal derivada de la
              garantía del producto. Se aceptan dentro de los{" "}
              <strong className="font-medium text-riviere-ink">
                5 días hábiles
              </strong>{" "}
              siguientes a la recepción del pedido, sujetos a disponibilidad de
              inventario.
            </p>
          </section>

          {/* Condiciones del producto */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Condiciones del producto para cambio
            </p>
            <p className="mb-5 text-sm text-riviere-smoke">
              Para que RIVIERE pueda procesar un cambio, la prenda debe
              encontrarse en las siguientes condiciones al momento de su
              devolución:
            </p>
            <ul className="space-y-4">
              {[
                "Sin uso, sin lavar y sin ningún tipo de alteración.",
                "Con todas las etiquetas y accesorios originales intactos.",
                "En el empaque original o en un empaque que garantice su protección.",
                "Libre de olores externos, manchas o cualquier señal de uso.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-sm leading-[1.8] text-riviere-smoke"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Costos de transporte */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Costos de transporte
            </p>
            <div className="space-y-4 text-sm leading-[1.9] text-riviere-smoke">
              <p>
                Los gastos de transporte asociados a cambios por talla, gusto o
                preferencia personal{" "}
                <strong className="font-medium text-riviere-ink">
                  corren por cuenta del cliente
                </strong>
                , tanto para el retorno del producto original como para el
                despacho del artículo de reemplazo.
              </p>
              <p>
                En caso de defecto de fabricación debidamente verificado, o de
                error atribuible a RIVIERE en el producto despachado,{" "}
                <strong className="font-medium text-riviere-ink">
                  RIVIERE asumirá la totalidad de los costos de transporte
                </strong>
                . Estas situaciones se gestionan bajo nuestra{" "}
                <Link
                  href="/garantia"
                  className="text-riviere-ink underline underline-offset-4"
                >
                  Política de Garantía
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Exclusiones */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Casos en que no se acepta el cambio
            </p>
            <p className="mb-5 text-sm text-riviere-smoke">
              RIVIERE se reserva el derecho de rechazar solicitudes de cambio
              cuando:
            </p>
            <ul className="space-y-4">
              {[
                "La prenda haya sido usada, lavada o sometida a cualquier proceso de limpieza.",
                "Las etiquetas originales estén removidas, cortadas o alteradas.",
                "El producto presente deterioro atribuible al manejo inadecuado por parte del cliente.",
                "La solicitud se realice fuera del plazo de 5 días hábiles establecido.",
                "El producto llegue sin el empaque de protección adecuado.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-sm leading-[1.8] text-riviere-smoke"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Diferencias de apariencia */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Diferencias de apariencia
            </p>
            <p className="text-sm leading-[1.9] text-riviere-smoke">
              Las variaciones normales de textura, tonalidad o apariencia
              propias de los materiales utilizados, así como las diferencias
              perceptibles entre las fotografías del producto y el artículo
              recibido debidas a la configuración de pantallas o dispositivos,
              no constituyen defecto de fabricación ni justifican la aplicación
              de la garantía. Estas situaciones podrán acogerse a la política de
              cambio comercial bajo las condiciones establecidas.
            </p>
          </section>

          {/* Proceso */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Cómo solicitar un cambio?
            </p>
            <div className="space-y-3 text-sm leading-[1.9] text-riviere-smoke">
              <p>
                Para iniciar el proceso, comunícate con nosotros por WhatsApp o
                al correo{" "}
                <a
                  href="mailto:riviere.co14@gmail.com"
                  className="text-riviere-ink underline underline-offset-4"
                >
                  riviere.co14@gmail.com
                </a>{" "}
                dentro del plazo correspondiente, indicando:
              </p>
              <ul className="space-y-2 pt-1">
                {[
                  "Número o referencia del pedido.",
                  "Motivo del cambio.",
                  "Fotografías del producto en su estado actual.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="pt-2">
                Nuestro equipo evaluará la solicitud e informará al cliente el
                resultado y los pasos a seguir en un plazo máximo de{" "}
                <strong className="font-medium text-riviere-ink">
                  2 días hábiles
                </strong>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
