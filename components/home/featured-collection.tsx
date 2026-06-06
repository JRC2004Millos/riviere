"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const products = [
  {
    name: "Oxford Noir",
    description: "Camisa estructurada en algodón compacto.",
    image: "/images/riviere-card-oxford.png",
  },
  {
    name: "Linen Sand",
    description: "Textura ligera para una silueta relajada.",
    image: "/images/riviere-card-linen.png",
  },
  {
    name: "Evening White",
    description: "Blanco preciso con cuello de presencia limpia.",
    image: "/images/riviere-card-white.png",
  },
];

export function FeaturedCollection() {
  return (
    <section id="coleccion" className="bg-riviere-bone py-20 md:py-28">
      <div className="container">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-riviere-smoke">
              Colección destacada
            </p>
            <h2 className="mt-3 text-3xl font-medium uppercase tracking-[0.08em] md:text-5xl">
              Esenciales con carácter
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-riviere-smoke">
            Una seleccion de camisas Givenchy curada por RIVIERE para construir
            una presencia masculina sobria, editorial y atemporal.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group border border-riviere-ink/10 bg-riviere-stone"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
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
          ))}
        </div>
      </div>
    </section>
  );
}
