import Link from "next/link";

export const metadata = {
  title: "Garantía — RIVIERE",
};

export default function GarantiaPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Garantía</span>
        </nav>

        <h1 className="mb-14 text-2xl font-light uppercase tracking-[0.22em]">
          Política de Garantía
        </h1>

        <div className="max-w-2xl space-y-12">
          {/* Término */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Término
            </p>
            <p className="text-sm leading-[1.9] text-riviere-smoke">
              En RIVIERE ofrecemos garantía de{" "}
              <strong className="font-medium text-riviere-ink">
                1 mes (30 días calendario)
              </strong>{" "}
              contado a partir de la fecha de entrega del producto.
            </p>
          </section>

          {/* Alcance */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Alcance de la garantía
            </p>
            <p className="mb-5 text-sm leading-[1.9] text-riviere-smoke">
              La garantía cubre la obligación de responder por el buen estado
              del producto y su conformidad con las condiciones de idoneidad,
              calidad y seguridad legalmente exigibles o las ofrecidas al
              momento de la compra.
            </p>
            <p className="text-sm leading-[1.9] text-riviere-smoke">
              Para hacer válida la garantía, la prenda debe encontrarse en
              condiciones que permitan verificar que el defecto proviene de
              fabricación y no del uso.
            </p>
          </section>

          {/* Solución de la garantía */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Solución de la garantía
            </p>

            <div className="space-y-4 text-sm leading-[1.9] text-riviere-smoke">
              <p>
                Si, luego de la evaluación correspondiente, se determina la
                existencia de un defecto cubierto por la presente garantía,
                RIVIERE podrá, según la naturaleza del caso, reparar el
                producto, sustituirlo por uno igual o de características
                equivalentes, o efectuar la devolución del dinero cuando las
                alternativas anteriores no resulten procedentes.
              </p>

              <p>
                La solución aplicable será determinada teniendo en cuenta las
                condiciones particulares del producto, la disponibilidad de
                inventario y la normativa vigente.
              </p>
            </div>
          </section>

          {/* Exclusiones */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Exclusiones
            </p>
            <p className="mb-5 text-sm text-riviere-smoke">
              La garantía{" "}
              <strong className="font-medium text-riviere-ink">no cubre</strong>{" "}
              los siguientes casos:
            </p>
            <ul className="space-y-4">
              {[
                "Deterioro normal del producto por uso cotidiano.",
                "Uso indebido o contrario al propósito del producto.",
                "Daños ocasionados por no atender las instrucciones de cuidado o mantenimiento de la prenda.",
                "Prendas sucias o con daños que no sean atribuibles a defectos de fábrica.",
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

          {/* Consideraciones */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Consideraciones
            </p>

            <div className="space-y-4 text-sm leading-[1.9] text-riviere-smoke">
              <p>
                Las diferencias normales de textura, tonalidad o apariencia
                propias de los materiales utilizados, así como las variaciones
                que puedan apreciarse entre fotografías y el producto recibido
                debido a la configuración de pantallas o dispositivos, no
                constituyen defectos de fabricación.
              </p>

              <p>
                Los cambios solicitados por razones de talla, gusto personal,
                preferencias estéticas o cualquier circunstancia distinta a un
                defecto de fabricación no constituyen una reclamación de
                garantía y estarán sujetos a las políticas comerciales
                aplicables.
              </p>
            </div>
          </section>

          {/* Proceso */}
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Cómo hacer válida la garantía?
            </p>
            <div className="space-y-3 text-sm leading-[1.9] text-riviere-smoke">
              <p>
                Para iniciar el proceso de garantía, comunícate con nosotros por
                WhatsApp o al correo{" "}
                <a
                  href="mailto:riviere.co14@gmail.com"
                  className="text-riviere-ink underline underline-offset-4"
                >
                  riviere.co14@gmail.com
                </a>{" "}
                dentro del período de garantía, indicando:
              </p>
              <ul className="space-y-2 pt-1">
                {[
                  "Número o referencia del pedido.",
                  "Descripción del defecto encontrado.",
                  "Fotografías del defecto.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="pt-2">
                Una vez recibida la información requerida, RIVIERE realizará la
                evaluación correspondiente e informará al cliente el resultado
                de la solicitud y los pasos a seguir.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
