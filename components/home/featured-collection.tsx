"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const CARD_W = 288; // w-72 en px
const GAP = 24; // gap-6 en px

type Item = {
  name: string;
  slug: string;
  image: string | null;
  description?: string;
};

const products: Item[] = [
  {
    name: "Oxford",
    slug: "Oxford",
    image: "/images/OXFORD.png",
    description:
      "Un esencial contemporáneo diseñado para acompañar el día a día con elegancia natural.",
  },
  {
    name: "Formal",
    slug: "Traje",
    image: "/images/formal.png",
    description: "La expresión más depurada de la sastrería moderna.",
  },
  {
    name: "Cuadros",
    slug: "Cuadros",
    image: "/images/cuadros.png",
    description: "Un clásico masculino que combina tradición y carácter.",
  },
  {
    name: "Rayas",
    slug: "Rayas",
    image: "/images/rayas.png",
    description:
      "Proporciones precisas que aportan profundidad visual y distinción.",
  },
  {
    name: "Diseños",
    slug: "Diseños",
    image: "/images/disenos.png",
    description:
      "Texturas y patrones sutiles que distinguen cada pieza con personalidad propia.",
  },
];

const items: Item[] = [
  ...products,
  { name: "Ver todas", slug: "__all__", image: null },
];

export function FeaturedCollection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({
      left: dir * (CARD_W + GAP),
      behavior: "smooth",
    });

  return (
    <>
      <style>{`
        .riv-track::-webkit-scrollbar { display: none; }
        .riv-track { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section id="coleccion" className="bg-riviere-sand py-20 md:py-28">
        {/* Encabezado */}
        <div className="container mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-riviere-smoke">
                Colección destacada
              </p>
              <h2 className="mt-3 text-3xl font-medium uppercase tracking-[0.08em] md:text-5xl">
                COLECCIÓN - ARCHIVO GIVENCHY
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-riviere-smoke">
              Una curaduría de camisas Givenchy que privilegia la sobriedad, la
              calidad y la permanencia por encima de las tendencias.
            </p>
          </div>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Flecha izquierda */}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-riviere-ink shadow backdrop-blur-sm transition-all duration-200 hover:bg-white md:left-4 ${
              atStart ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Track deslizable — touch y scroll nativo */}
          <div
            ref={trackRef}
            className="riv-track flex gap-6 overflow-x-auto scroll-pl-6 px-6 md:justify-between"
          >
            {items.map((item) => (
              <Link
                key={item.slug}
                href={
                  item.slug === "__all__"
                    ? "/catalogo"
                    : `/catalogo?estilo=${item.slug}`
                }
                className="group flex w-72 flex-shrink-0 flex-col"
              >
                {item.image ? (
                  <article className="flex flex-1 flex-col border border-riviere-ink/10 bg-riviere-stone">
                    {/* imagen cuadrada fija — flex-shrink-0 evita que se comprima */}
                    <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes={`${CARD_W}px`}
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    {/* texto ocupa el espacio restante → todas las tarjetas misma altura */}
                    <div className="flex flex-1 flex-col px-5 py-4">
                      <h3 className="text-sm font-medium uppercase tracking-[0.14em]">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="mt-2 text-xs leading-5 text-riviere-smoke">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                ) : (
                  <article className="flex flex-1 flex-col bg-riviere-ink text-white">
                    <div className="flex aspect-square w-full flex-shrink-0 flex-col items-center justify-center gap-4 px-8 text-center">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-white/40">
                        Catálogo completo
                      </p>
                      <p className="text-4xl font-light uppercase leading-tight tracking-[0.2em]">
                        Ver
                        <br />
                        todas
                      </p>
                      <span className="text-lg text-white/50 transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                        →
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-5 py-4">
                      <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-white/70">
                        Ver todas
                      </h3>
                    </div>
                  </article>
                )}
              </Link>
            ))}
          </div>

          {/* Flecha derecha */}
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-riviere-ink shadow backdrop-blur-sm transition-all duration-200 hover:bg-white md:right-4 ${
              atEnd ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
