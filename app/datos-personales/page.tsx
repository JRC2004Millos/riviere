import Link from "next/link";

export const metadata = {
  title: "Datos Personales — RIVIERE",
};

export default function DatosPersonalesPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Datos Personales</span>
        </nav>

        <h1 className="mb-14 text-2xl font-light uppercase tracking-[0.22em]">
          Datos Personales
        </h1>

        <div className="max-w-2xl space-y-12 text-sm leading-[1.9] text-riviere-smoke">
          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Qué datos recopilamos?
            </p>
            <p className="mb-5">
              Para procesar y entregar su pedido solicitamos únicamente los
              datos indispensables:
            </p>
            <ul className="space-y-4">
              {[
                {
                  label: "Nombre completo",
                  desc: "Para identificación y registro del pedido.",
                },
                {
                  label: "Correo electrónico",
                  desc: "Para envío de confirmaciones y comunicaciones sobre su pedido.",
                },
                {
                  label: "Teléfono",
                  desc: "Para coordinación de la entrega.",
                },
                {
                  label: "Dirección de entrega",
                  desc: "Para el despacho del producto a su lugar de preferencia.",
                },
              ].map(({ label, desc }) => (
                <li key={label} className="flex gap-5">
                  <span className="mt-[2px] min-w-[140px] text-xs uppercase tracking-[0.14em] text-riviere-smoke">
                    {label}
                  </span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Qué datos NO manejamos?
            </p>
            <p className="mb-4">
              <strong className="font-medium text-riviere-ink">RIVIERE no almacena ni procesa datos financieros</strong>{" "}
              de ningún tipo. Esto incluye:
            </p>
            <ul className="space-y-2">
              {[
                "Números de tarjeta de crédito o débito.",
                "Códigos de seguridad (CVV/CVC).",
                "Datos de cuentas bancarias.",
                "Credenciales de acceso a entidades financieras.",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5">
              Todo el procesamiento de pagos es gestionado directamente por{" "}
              <strong className="font-medium text-riviere-ink">Wompi</strong>, plataforma
              de pagos certificada bajo el estándar internacional{" "}
              <strong className="font-medium text-riviere-ink">PCI-DSS</strong>. Al
              momento de pagar, usted es redirigido a un entorno seguro de
              Wompi y RIVIERE nunca accede a su información bancaria.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Cómo usamos sus datos?
            </p>
            <p>
              Sus datos se usan exclusivamente para el cumplimiento de su
              pedido: procesar la compra, coordinar el envío y comunicarnos
              con usted sobre el estado del mismo. No compartimos su información
              con terceros para fines comerciales o publicitarios.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              ¿Cuánto tiempo conservamos sus datos?
            </p>
            <p>
              Sus datos se conservan el tiempo estrictamente necesario para
              completar la transacción y cumplir con las obligaciones legales
              aplicables bajo la legislación colombiana. Una vez cumplida la
              finalidad, los datos son eliminados de forma segura.
            </p>
          </section>

          <section className="border-t border-riviere-ink/10 pt-8">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
              Sus derechos — Habeas Data
            </p>
            <p className="mb-4">
              Conforme a la Ley 1581 de 2012, puede en cualquier momento:
            </p>
            <ul className="space-y-2">
              {[
                "Consultar los datos que tenemos registrados sobre usted.",
                "Solicitar la corrección de datos incorrectos o desactualizados.",
                "Pedir la eliminación de sus datos personales.",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-riviere-smoke/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5">
              Para ejercer estos derechos escríbanos a{" "}
              <a
                href="mailto:riviere.co14@gmail.com"
                className="text-riviere-ink underline underline-offset-4"
              >
                riviere.co14@gmail.com
              </a>
              . Respondemos en un plazo máximo de 15 días hábiles.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
