import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Guía de Tallas — RIVIERE",
};

export default function GuiaDeTallasPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#111]">
      <div className="container py-12">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-riviere-smoke">
          <Link href="/" className="transition-colors hover:text-riviere-ink">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo" className="transition-colors hover:text-riviere-ink">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-riviere-ink">Guía de Tallas</span>
        </nav>

        <h1 className="mb-4 text-2xl font-light uppercase tracking-[0.22em]">
          Guía de Tallas
        </h1>
        <p className="mb-14 text-sm text-riviere-smoke">
          Consulta la tabla de medidas para encontrar tu talla ideal.
        </p>

        {/* Imagen de guía */}
        <div className="mb-14 max-w-xl">
          <Image
            src="/images/GuiaTallas.jpg"
            alt="Guía de tallas RIVIERE"
            width={1000}
            height={1500}
            className="w-full rounded-sm"
            priority
          />
        </div>

        {/* Cómo tomar medidas */}
        <section className="max-w-2xl border-t border-riviere-ink/10 pt-10">
          <p className="mb-6 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
            Cómo tomar tus medidas
          </p>
          <ul className="space-y-5">
            {[
              {
                label: "Pecho",
                desc: "Mide alrededor de la parte más ancha del pecho, pasando por debajo de los brazos. Mantén la cinta métrica horizontal.",
              },
              {
                label: "Hombros",
                desc: "Mide de un extremo del hombro al otro, por la parte posterior, de costura a costura.",
              },
              {
                label: "Largo de manga",
                desc: "Con el brazo extendido, mide desde el hombro hasta la muñeca.",
              },
              {
                label: "Cuello",
                desc: "Mide alrededor de la base del cuello con la cinta ligeramente holgada.",
              },
            ].map(({ label, desc }) => (
              <li key={label} className="flex gap-5 text-sm leading-[1.8]">
                <span className="mt-[2px] min-w-[80px] text-xs uppercase tracking-[0.16em] text-riviere-smoke">
                  {label}
                </span>
                <span className="text-riviere-smoke">{desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 max-w-2xl border-t border-riviere-ink/10 pt-8">
          <p className="text-sm leading-[1.9] text-riviere-smoke">
            Si quedas entre dos tallas, te recomendamos elegir la más grande
            para mayor comodidad. Si tienes dudas, escríbenos por WhatsApp y
            con gusto te orientamos.
          </p>
        </section>
      </div>
    </main>
  );
}
