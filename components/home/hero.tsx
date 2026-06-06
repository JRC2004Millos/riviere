"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-riviere-bone pt-16 text-riviere-ink">
      <div className="container grid min-h-[calc(100svh-4rem)] gap-12 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p className="mb-5 text-xs uppercase tracking-[0.28em] text-riviere-smoke">
            Curaduria RIVIERE de camisas Givenchy
          </p>
          <div className="relative h-20 w-full max-w-[520px] sm:h-24 md:h-28">
            <Image
              src="/images/RIVIERE.png"
              alt="RIVIERE"
              fill
              priority
              sizes="(min-width: 768px) 520px, 90vw"
              className="object-contain object-left"
            />
          </div>
          <p className="mt-7 text-base leading-7 text-riviere-smoke md:text-lg">
            Camisas Givenchy seleccionadas y presentadas bajo la experiencia
            RIVIERE: elegancia masculina, detalle premium y compra curada.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-9 border-riviere-ink text-riviere-ink hover:bg-riviere-ink hover:text-riviere-bone"
          >
            <Link href="/catalogo">Ver Colección</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="grid gap-4 md:grid-cols-[0.65fr_1fr] md:items-end md:gap-6"
        >
          <div className="hidden space-y-4 md:block md:space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden bg-riviere-stone">
              <Image
                src="/images/S13-38C.png"
                alt="Camisa RIVIERE S13-38C"
                fill
                priority
                sizes="(min-width: 768px) 26vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-riviere-stone">
              <Image
                src="/images/S11-216A-11.png"
                alt="Camisa RIVIERE S11-216A-11"
                fill
                sizes="(min-width: 768px) 26vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden bg-riviere-stone md:aspect-[4/5]">
            <Image
              src="/images/riviere1.jpeg"
              alt="Curaduria RIVIERE de camisas Givenchy"
              fill
              priority
              sizes="(min-width: 768px) 34vw, 52vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
