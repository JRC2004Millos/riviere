export function AboutRiviere() {
  return (
    <section className="bg-riviere-bone py-20 md:py-28">
      <div className="container grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-riviere-smoke">
            Acerca de RIVIERE
          </p>
          <h2 className="mt-3 text-3xl font-medium uppercase tracking-[0.08em] md:text-5xl">
            Givenchy original, seleccionado por RIVIERE
          </h2>
        </div>

        <div className="grid gap-10 text-sm leading-6 text-riviere-smoke md:grid-cols-2">
          <div>
            <h3 className="text-base font-medium uppercase tracking-[0.14em] text-riviere-ink">
              Quiénes somos
            </h3>
            <p className="mt-4">
              RIVIERE es una tienda en línea de camisas Givenchy 100%
              originales, seleccionadas con una lectura premium y editorial.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium uppercase tracking-[0.14em] text-riviere-ink">
              Precio y origen
            </h3>
            <p className="mt-4">
              Trabajamos camisas originales de colecciones antiguas (2007–2013),
              completamente nuevas, que conservan calidad, estilo y vigencia.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium uppercase tracking-[0.14em] text-riviere-ink">
              Compra tranquilo
            </h3>
            <p className="mt-4">Envíos a todo el país.</p>
            <p className="mt-4">
              Pago contraentrega y envíos GRATIS (únicamente aplica para Bogotá)
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium uppercase tracking-[0.14em] text-riviere-ink">
              Contáctanos
            </h3>
            <p className="mt-4">
              WhatsApp: +57 300 1368601
              <br />
              Instagram: @Riviere_co
              <br />
              Correo: riviere.co14@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
