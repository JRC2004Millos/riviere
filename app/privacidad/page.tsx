import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad — RIVIERE",
};

const LAST_UPDATE = "Junio 2026";

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Política de Privacidad</span>
        </nav>

        <h1 className="mb-3 text-2xl font-light uppercase tracking-[0.22em]">
          Política de Privacidad
        </h1>
        <p className="mb-14 text-xs uppercase tracking-[0.16em] text-riviere-smoke/60">
          Última actualización: {LAST_UPDATE}
        </p>

        <div className="max-w-2xl space-y-12 text-sm leading-[1.9] text-riviere-smoke">
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              1. Responsable del tratamiento
            </p>
            <p>
              <strong className="font-medium text-riviere-ink">RIVIERE</strong> es
              responsable del tratamiento de los datos personales que usted
              proporciona al realizar una compra en nuestro sitio web. Puede
              contactarnos en{" "}
              <a
                href="mailto:riviere.co14@gmail.com"
                className="text-riviere-ink underline underline-offset-4"
              >
                riviere.co14@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              2. Marco legal
            </p>
            <p>
              El tratamiento de datos personales en RIVIERE se rige por la{" "}
              <strong className="font-medium text-riviere-ink">
                Ley 1581 de 2012
              </strong>{" "}
              (Protección de Datos Personales en Colombia) y el Decreto
              1377 de 2013 que la reglamenta. La entidad que vela por el
              cumplimiento de esta ley es la Superintendencia de Industria y
              Comercio (SIC).
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              3. Datos que recopilamos
            </p>
            <p className="mb-4">
              Al realizar una compra, recopilamos únicamente la información
              estrictamente necesaria para el procesamiento y entrega de su
              pedido:
            </p>
            <ul className="space-y-2">
              {[
                "Nombre completo",
                "Dirección de correo electrónico",
                "Número de teléfono",
                "Dirección de entrega",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              No recopilamos ni almacenamos datos bancarios, números de tarjeta
              de crédito ni información financiera de ningún tipo. El
              procesamiento de pagos es realizado exclusivamente por{" "}
              <strong className="font-medium text-riviere-ink">Wompi</strong>,
              plataforma certificada bajo estándares de seguridad PCI-DSS.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              4. Finalidades del tratamiento
            </p>
            <p className="mb-4">Usamos su información exclusivamente para:</p>
            <ul className="space-y-2">
              {[
                "Procesar y gestionar su pedido.",
                "Coordinar la entrega del producto.",
                "Comunicarnos con usted sobre el estado de su pedido.",
                "Cumplir con las obligaciones legales y regulatorias aplicables.",
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
              5. Conservación de datos
            </p>
            <p>
              Sus datos personales se conservarán durante el tiempo necesario
              para cumplir con las finalidades descritas y conforme a las
              obligaciones legales aplicables en Colombia. Una vez cumplidas
              dichas finalidades, sus datos serán suprimidos de forma segura.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              6. Seguridad de la información
            </p>
            <p>
              Implementamos medidas técnicas y organizativas razonables para
              proteger su información personal contra accesos no autorizados,
              pérdida, alteración o divulgación indebida. Las comunicaciones
              entre su navegador y nuestro servidor se realizan bajo protocolo
              seguro HTTPS.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              7. Derechos del titular
            </p>
            <p className="mb-4">
              De conformidad con la Ley 1581 de 2012, usted tiene derecho a:
            </p>
            <ul className="space-y-2">
              {[
                "Conocer los datos personales que tenemos sobre usted.",
                "Actualizarlos y rectificarlos cuando sean incorrectos o incompletos.",
                "Solicitar su supresión cuando no exista obligación legal de conservarlos.",
                "Revocar la autorización para su tratamiento.",
                "Presentar queja ante la Superintendencia de Industria y Comercio (SIC).",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Para ejercer cualquiera de estos derechos, escríbanos a{" "}
              <a
                href="mailto:riviere.co14@gmail.com"
                className="text-riviere-ink underline underline-offset-4"
              >
                riviere.co14@gmail.com
              </a>
              . Le responderemos en un plazo máximo de 15 días hábiles.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              8. Cambios a esta política
            </p>
            <p>
              Podemos actualizar esta política en cualquier momento. Los cambios
              significativos se comunicarán a través del sitio web. Le
              recomendamos revisarla periódicamente.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
