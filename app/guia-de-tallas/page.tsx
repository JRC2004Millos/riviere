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
          <Link href="/" className="transition-colors hover:text-riviere-ink">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/catalogo"
            className="transition-colors hover:text-riviere-ink"
          >
            Catálogo
          </Link>
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
        <div className="mb-14 max-w-xl mx-auto">
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
                label: "Cuello",
                desc: "Mide alrededor de la base del cuello con la cinta ligeramente holgada.",
              },
              {
                label: "Cintura",
                desc: "Mide alrededor de la parte más ancha de la cintura, manteniendo la cinta métrica horizontal.",
              },
              {
                label: "Manga",
                desc: "Con el brazo extendido, mide desde el hombro hasta la muñeca.",
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
            Cada talla en tallas francesas tiene un intermedio, si estás entre
            un S (14 1/2) y un M (15 1/2) lo mejor es que elijas una S-M (15).
          </p>
          <p className="text-sm leading-[1.9] text-riviere-smoke">
            La mejor forma de estar seguros es que tomes la camisa de tu armario
            que mejor te quede y tomes estas medidas. Te recomendamos siempre
            tener muy en cuenta la medida de tu cuello.
          </p>
        </section>
      </div>
    </main>
  );
}
