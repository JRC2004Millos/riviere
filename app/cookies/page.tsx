import Link from "next/link";

export const metadata = {
  title: "Política de Cookies — RIVIERE",
};

const LAST_UPDATE = "Junio 2026";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Cookies</span>
        </nav>

        <h1 className="mb-3 text-2xl font-light uppercase tracking-[0.22em]">
          Política de Cookies
        </h1>
        <p className="mb-14 text-xs uppercase tracking-[0.16em] text-riviere-smoke/60">
          Última actualización: {LAST_UPDATE}
        </p>

        <div className="max-w-2xl space-y-12 text-sm leading-[1.9] text-riviere-smoke">
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Qué son las cookies?
            </p>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web
              almacenan en su navegador cuando los visita. Permiten al sitio
              recordar información sobre su visita, como su sesión activa.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Qué cookies usa RIVIERE?
            </p>
            <p className="mb-6">
              RIVIERE utiliza{" "}
              <strong className="font-medium text-riviere-ink">
                únicamente cookies de sesión técnicamente necesarias
              </strong>{" "}
              para el funcionamiento del sitio. No usamos cookies de rastreo,
              análisis ni publicidad de ningún tipo.
            </p>

            <div className="overflow-hidden rounded-sm border border-riviere-ink/10">
              <table className="w-full text-xs">
                <thead className="bg-riviere-stone/40">
                  <tr>
                    <th className="px-4 py-3 text-left uppercase tracking-[0.16em] text-riviere-smoke">
                      Cookie
                    </th>
                    <th className="px-4 py-3 text-left uppercase tracking-[0.16em] text-riviere-smoke">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left uppercase tracking-[0.16em] text-riviere-smoke">
                      Propósito
                    </th>
                    <th className="px-4 py-3 text-left uppercase tracking-[0.16em] text-riviere-smoke">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-riviere-ink/8">
                  <tr>
                    <td className="px-4 py-3 font-mono text-[11px] text-riviere-ink">
                      authjs.session-token
                    </td>
                    <td className="px-4 py-3">Sesión</td>
                    <td className="px-4 py-3">
                      Mantiene activa la sesión del administrador del sitio.
                      No aplica a compradores.
                    </td>
                    <td className="px-4 py-3">8 horas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Lo que NO hacemos
            </p>
            <ul className="space-y-2">
              {[
                "No usamos cookies de rastreo de comportamiento.",
                "No usamos herramientas de analítica de terceros (Google Analytics, Hotjar, etc.).",
                "No compartimos datos de cookies con redes publicitarias.",
                "No usamos cookies de personalización ni remarketing.",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Cookies de terceros — Wompi
            </p>
            <p>
              Al ser redirigido a la plataforma de pagos{" "}
              <strong className="font-medium text-riviere-ink">Wompi</strong> para
              completar su compra, dicha plataforma puede establecer sus
              propias cookies en su navegador, de acuerdo con su propia
              política de privacidad. RIVIERE no tiene control sobre las
              cookies de Wompi ni acceso a la información que estas puedan
              recopilar.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Cómo gestionar las cookies?
            </p>
            <p>
              Puede configurar su navegador para rechazar o eliminar cookies.
              Tenga en cuenta que desactivar las cookies de sesión puede
              afectar el funcionamiento del área de administración del sitio,
              pero no impacta la experiencia de compra para clientes.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Contacto
            </p>
            <p>
              Si tiene preguntas sobre esta política, puede escribirnos a{" "}
              <a
                href="mailto:riviere.co14@gmail.com"
                className="text-riviere-ink underline underline-offset-4"
              >
                riviere.co14@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
