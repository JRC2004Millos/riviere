"use client";

import { motion } from "framer-motion";

const values = [
  {
    title: "Calidad",
    copy: "Confección, materiales y atención al detalle como solo Givenchy sabe hacerlo.",
  },
  {
    title: "Diseño",
    copy: "Diseños concebidos para perdurar, no para seguir tendencias. Una estética atemporal seleccionada por su permanencia.",
  },
  {
    title: "Exclusividad",
    copy: "Una oportunidad irrepetible de adquirir piezas Givenchy de archivo. Piezas limitadas. Sin reposiciones.",
  },
];

export function BrandValues() {
  return (
    <section
      id="valores"
      className="bg-riviere-ink py-20 text-riviere-bone md:py-28"
    >
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-riviere-bone/62">
            En Riviere comprendemos
          </p>
          <h2 className="mt-3 text-3xl font-medium uppercase tracking-[0.08em] md:text-5xl">
            EL VALOR DE PERMANECER
          </h2>
        </div>

        <div className="mt-14 grid gap-px bg-riviere-bone/16 md:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
              className="bg-riviere-ink p-8 md:p-10"
            >
              <span className="text-xs uppercase tracking-[0.24em] text-riviere-bone/46">
                0{index + 1}
              </span>
              <h3 className="mt-8 text-xl font-medium uppercase tracking-[0.14em]">
                {value.title}
              </h3>
              <p className="mt-5 text-sm leading-6 text-riviere-bone/68">
                {value.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
