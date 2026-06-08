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
    <section className="relative min-h-svh overflow-hidden bg-white pt-20 text-[#111]">
      <MotionLink
        href="/catalogo"
        className="absolute right-0 top-20 bottom-0 w-[70%]"
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
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </MotionLink>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_25%,rgba(255,255,255,0.75)_45%,rgba(255,255,255,0.1)_70%,rgba(255,255,255,0)_100%)]" />

      <div className="pointer-events-none container relative z-10 grid min-h-[calc(100svh-5rem)] gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto max-w-lg"
        >
          <p className="mb-7 text-xs uppercase tracking-[0.34em] text-riviere-smoke">
            Camisas masculinas premium
          </p>
          <div className="relative h-20 w-full max-w-[430px] md:h-24">
            <Image
              src="/images/RIVIERE.png"
              alt="RIVIERE"
              fill
              priority
              sizes="(min-width: 768px) 430px, 90vw"
              className="object-contain object-left"
            />
          </div>
          <p className="mt-8 max-w-md text-lg leading-8 text-riviere-smoke">
            Elegancia masculina, materiales seleccionados y diseno atemporal
            para cada ocasion.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-9 border-[#111] bg-white/20 text-[#111] hover:bg-[#111] hover:text-white"
          >
            <Link href="/catalogo">Ver Coleccion</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
