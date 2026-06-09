"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "sans-serif",
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "8rem", fontWeight: 300, opacity: 0.08, lineHeight: 1, margin: 0 }}>
            500
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Rivie sorprendido.png"
            alt="Rivie sorprendido"
            style={{ width: 192, height: 192, objectFit: "contain", marginTop: "-1.5rem" }}
          />
          <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.28em", color: "#888" }}>
            Error inesperado
          </p>
          <div style={{ marginTop: "2.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 2rem",
                border: "1px solid #111",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Reintentar
            </button>
            <a
              href="/"
              style={{
                padding: "0.75rem 2rem",
                border: "1px solid #111",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "#111",
              }}
            >
              Inicio
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
