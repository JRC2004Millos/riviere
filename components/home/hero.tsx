"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const MotionLink = motion(Link);

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white pt-20 text-[#111] min-h-[80svh] md:min-h-svh">
      {/*
       * Imagen editorial
       * Mobile  → inset-0 (full bleed detrás del texto)
       * Desktop → right-0 top-20 bottom-0 w-[70%] (estructura original)
       */}
      <MotionLink
        href="/catalogo"
        aria-label="Ver colección"
        className="absolute inset-0 md:inset-auto md:right-0 md:top-20 md:bottom-0 md:w-[70%]"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{
          duration: isHovered ? 3 : 9,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Image
          src="/images/riviere1.jpeg"
          alt="Camisas Givenchy curadas por RIVIERE"
          fill
          priority
          sizes="(min-width: 768px) 70vw, 100vw"
          className="object-cover object-center"
        />
      </MotionLink>

      {/* Overlay mobile — degradado oscuro de abajo hacia arriba para legibilidad */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Overlay desktop — gradiente blanco que cubre la zona del texto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_25%,rgba(255,255,255,0.75)_45%,rgba(255,255,255,0.1)_70%,rgba(255,255,255,0)_100%)]"
      />

      {/*
       * Contenido
       * Mobile  → flex column, justify-end (texto en la parte inferior)
       * Desktop → grid 2 columnas, centrado verticalmente
       */}
      <div className="pointer-events-none container relative z-10 flex min-h-[80svh] flex-col justify-end pb-14 md:grid md:min-h-[calc(100svh-5rem)] md:grid-cols-2 md:items-center md:justify-normal md:pb-0 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto max-w-lg"
        >
          {/* Kicker */}
          <p className="mb-6 text-xs uppercase tracking-[0.34em] text-white/70 md:text-riviere-smoke">
            Camisas masculinas premium
          </p>

          {/* Logo — versión blanca en mobile, oscura en desktop */}
          <div className="relative h-16 w-full max-w-[340px] md:hidden">
            <Image
              src="/images/RIVIERE blanco.png"
              alt="RIVIERE"
              fill
              priority
              sizes="340px"
              className="object-contain object-left"
            />
          </div>
          <div className="relative hidden h-20 w-full max-w-[430px] md:block md:h-24">
            <Image
              src="/images/RIVIERE.png"
              alt="RIVIERE"
              fill
              priority
              sizes="430px"
              className="object-contain object-left"
            />
          </div>

          {/* Descripción */}
          <p className="mt-7 max-w-sm text-base leading-[1.85] text-white/80 md:max-w-md md:text-lg md:leading-8 md:text-riviere-smoke">
            Camisas Givenchy, el mejor estilo para hombre de una de las marcas
            de moda más prestigiosas de Francia y del mundo
          </p>

          {/* CTA */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-9 border-white/80 bg-transparent text-white hover:bg-white hover:text-[#111] md:border-[#111] md:bg-white/20 md:text-[#111] md:hover:bg-[#111] md:hover:text-white"
          >
            <Link href="/catalogo">Ver Colección</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
