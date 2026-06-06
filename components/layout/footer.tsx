import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-riviere-ink/10 bg-riviere-bone">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="relative h-8 w-40">
            <Image
              src="/images/RIVIERE.png"
              alt="RIVIERE"
              fill
              sizes="160px"
              className="object-contain object-left"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-riviere-smoke">
            Curaduria RIVIERE de camisas Givenchy con una lectura sobria,
            precisa y contemporanea.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">Marca</p>
          <Link className="block text-riviere-ink" href="/catalogo">
            Catalogo
          </Link>
          <Link className="block text-riviere-ink" href="/#valores">
            Valores
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">Sistema</p>
          <Link className="block text-riviere-ink" href="/admin">
            Admin
          </Link>
          <Link className="block text-riviere-ink" href="/checkout">
            Checkout
          </Link>
        </div>
      </div>
      <div className="container flex flex-col gap-3 border-t border-riviere-ink/10 py-5 text-xs uppercase tracking-[0.18em] text-riviere-smoke md:flex-row md:items-center md:justify-between">
        <p>© 2026 RIVIERE</p>
        <p>Hecho para una coleccion esencial</p>
      </div>
    </footer>
  );
}
