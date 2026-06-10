"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const products = [
  {
    name: "Oxford",
    slug: "Oxford",
    description:
      "Un esencial contemporáneo diseñado para acompañar el día a día con elegancia natural.",
    image: "/images/OXFORD.png",
  },
  {
    name: "Formal",
    slug: "Traje",
    description: "La expresión más depurada de la sastrería moderna.",
    image: "/images/formal.png",
  },
  {
    name: "Cuadros",
    slug: "Cuadros",
    description: "Un clásico masculino que combina tradición y carácter.",
    image: "/images/cuadros.png",
  },
  {
    name: "Rayas",
    slug: "Rayas",
    description:
      "Proporciones precisas que aportan profundidad visual y distinción.",
    image: "/images/rayas.png",
  },
  {
    name: "Diseños",
    slug: "Diseños",
    description:
      "Texturas y patrones sutiles que distinguen cada pieza con personalidad propia.",
    image: "/images/disenos.png",
  },
];

export function FeaturedCollection() {
  return (
    <section id="coleccion" className="bg-riviere-sand py-20 md:py-28">
      <div className="container">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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

        {/*
         * flex-wrap + justify-center centra la última fila sin cambiar tamaños.
         * Cada item ocupa el mismo ancho que ocuparía en grid-cols-2/3/4/5.
         */}
        <div className="flex flex-wrap justify-center gap-4">
          {products.map((product, index) => (
            <Link
              key={product.name}
              href={`/catalogo?estilo=${product.slug}`}
              className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]"
            >
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group h-full border border-riviere-ink/10 bg-riviere-stone"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium uppercase tracking-[0.12em]">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-riviere-smoke">
                    {product.description}
                  </p>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
