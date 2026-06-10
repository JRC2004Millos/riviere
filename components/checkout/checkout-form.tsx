"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/src/context/cart-context";
import { Button } from "@/components/ui/button";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const COSTO_ENVIO = 15_000;

type Dep = { id: number; nombre: string };
type Ciudad = { id: number; nombre: string };

type Fields = {
  nombre: string;
  email: string;
  telefono: string;
  departamentoId: string;
  ciudad: string;
  direccion: string;
};

// Valida que la dirección siga el formato colombiano: Calle/Carrera/etc + número
function validarDireccion(dir: string): string | null {
  const d = dir.trim();
  if (!d) return "La dirección es requerida";
  if (d.length < 10) return "La dirección parece incompleta";
  const RE =
    /^(calle|carrera|cra\.?|cll\.?|avenida|av\.?|transversal|tv\.?|diagonal|dg\.?|autopista|ak\.?)\s+\d/i;
  if (!RE.test(d)) {
    return 'Ingresa la dirección completa (ej: "Calle 123 # 45 - 67")';
  }
  return null;
}

const INPUT_CLS =
  "mt-2 w-full border-b border-riviere-ink/20 bg-transparent pb-2 text-sm outline-none transition-colors focus:border-riviere-ink placeholder:text-riviere-smoke/40";
const SELECT_CLS =
  "mt-2 w-full border-b border-riviere-ink/20 bg-transparent pb-2 text-sm outline-none transition-colors focus:border-riviere-ink appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
const LABEL_CLS = "text-xs uppercase tracking-[0.18em] text-riviere-smoke";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();

  const [fields, setFields] = useState<Fields>({
    nombre: "",
    email: "",
    telefono: "",
    departamentoId: "",
    ciudad: "",
    direccion: "",
  });

  const [departamentos, setDepartamentos] = useState<Dep[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [direccionError, setDireccionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/colombia")
      .then((r) => r.json())
      .then((data: Dep[]) => setDepartamentos(data))
      .catch(() => setDepartamentos([]))
      .finally(() => setLoadingDeps(false));
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-riviere-smoke">
          Tu carrito está vacío
        </p>
        <Button asChild variant="ghost" className="mt-8">
          <Link href="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleDepartamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const depId = e.target.value;
    setFields((f) => ({ ...f, departamentoId: depId, ciudad: "" }));
    setCiudades([]);
    if (!depId) return;
    setLoadingCiudades(true);
    fetch(`/api/colombia/ciudades?depId=${depId}`)
      .then((r) => r.json())
      .then((data: Ciudad[]) => setCiudades(data))
      .catch(() => setCiudades([]))
      .finally(() => setLoadingCiudades(false));
  };

  const esBogota = fields.ciudad.toLowerCase().includes("bogot");
  const envio = fields.ciudad && !esBogota ? COSTO_ENVIO : 0;
  const total = subtotal + envio;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fields.ciudad) {
      setError("Selecciona tu ciudad de entrega");
      return;
    }

    const dirErr = validarDireccion(fields.direccion);
    if (dirErr) {
      setDireccionError(dirErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            talla: i.talla,
            color: i.color,
            cantidad: i.cantidad,
          })),
          customer: {
            nombre: fields.nombre,
            email: fields.email,
            telefono: fields.telefono,
            ciudad: fields.ciudad,
            departamentoId: fields.departamentoId,
            direccion: fields.direccion,
          },
        }),
      });

      const data = (await res.json()) as { wompiUrl?: string; error?: string };

      if (!res.ok || !data.wompiUrl) {
        setError(data.error ?? "No se pudo crear la orden");
        setLoading(false);
        return;
      }

      clearCart();
      window.location.href = data.wompiUrl;
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-16 lg:grid-cols-[1fr_400px]"
    >
      {/* Resumen del pedido */}
      <div>
        <h2 className="mb-8 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
          Resumen del pedido
        </h2>

        <div className="divide-y divide-riviere-ink/10 border-y border-riviere-ink/10">
          {items.map((item) => (
            <div
              key={item.cartKey}
              className="flex items-center justify-between gap-4 py-5"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.14em]">
                  {item.estilo}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-riviere-smoke">
                  Talla {item.talla}
                  {item.color ? ` · ${item.color}` : ""}
                  {" · "}
                  {item.cantidad === 1
                    ? "1 unidad"
                    : `${item.cantidad} unidades`}
                </p>
              </div>
              <p className="text-sm tabular-nums">
                {COP.format(item.precio * item.cantidad)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
              Subtotal
            </p>
            <p className="text-sm tabular-nums">{COP.format(subtotal)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
              Envío
            </p>
            <p className="text-sm tabular-nums">
              {fields.ciudad ? (esBogota ? "Gratis" : COP.format(COSTO_ENVIO)) : "—"}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-riviere-ink/10 pt-3">
            <p className="text-xs uppercase tracking-[0.2em] text-riviere-smoke">
              Total
            </p>
            <p className="text-xl font-light tabular-nums">
              {COP.format(total)}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="border-t border-riviere-ink/10 pt-8 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
        <h2 className="mb-8 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
          Información de contacto
        </h2>

        <div className="space-y-6">
          <label className="block">
            <span className={LABEL_CLS}>Nombre completo *</span>
            <input
              name="nombre"
              required
              autoComplete="name"
              value={fields.nombre}
              onChange={handleChange}
              className={INPUT_CLS}
            />
          </label>

          <label className="block">
            <span className={LABEL_CLS}>Email *</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={fields.email}
              onChange={handleChange}
              className={INPUT_CLS}
            />
          </label>

          <label className="block">
            <span className={LABEL_CLS}>Teléfono</span>
            <input
              name="telefono"
              type="tel"
              autoComplete="tel"
              value={fields.telefono}
              onChange={handleChange}
              className={INPUT_CLS}
            />
          </label>

          {/* Departamento */}
          <label className="block">
            <span className={LABEL_CLS}>Departamento *</span>
            <select
              name="departamentoId"
              required
              value={fields.departamentoId}
              onChange={handleDepartamentoChange}
              disabled={loadingDeps}
              className={SELECT_CLS}
            >
              <option value="">
                {loadingDeps ? "Cargando..." : "Selecciona un departamento"}
              </option>
              {departamentos.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </label>

          {/* Ciudad */}
          <label className="block">
            <span className={LABEL_CLS}>Ciudad *</span>
            <select
              name="ciudad"
              required
              value={fields.ciudad}
              onChange={(e) =>
                setFields((f) => ({ ...f, ciudad: e.target.value }))
              }
              disabled={!fields.departamentoId || loadingCiudades}
              className={SELECT_CLS}
            >
              <option value="">
                {loadingCiudades
                  ? "Cargando ciudades..."
                  : !fields.departamentoId
                    ? "Selecciona el departamento primero"
                    : "Selecciona una ciudad"}
              </option>
              {ciudades.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {fields.ciudad && !esBogota && (
              <p className="mt-2 text-[11px] tracking-[0.1em] text-riviere-smoke">
                Se aplica costo de envío de {COP.format(COSTO_ENVIO)} fuera de
                Bogotá
              </p>
            )}
          </label>

          {/* Dirección */}
          <label className="block">
            <span className={LABEL_CLS}>Dirección de entrega *</span>
            <input
              name="direccion"
              required
              autoComplete="street-address"
              placeholder='Calle 123 # 45 - 67'
              value={fields.direccion}
              onChange={(e) => {
                handleChange(e);
                if (direccionError) setDireccionError(null);
              }}
              onBlur={() => {
                if (fields.direccion)
                  setDireccionError(validarDireccion(fields.direccion));
              }}
              className={`${INPUT_CLS} ${direccionError ? "border-red-400 focus:border-red-500" : ""}`}
            />
            {direccionError ? (
              <p className="mt-2 text-[11px] tracking-[0.1em] text-red-600">
                {direccionError}
              </p>
            ) : (
              <p className="mt-2 text-[11px] tracking-[0.1em] text-riviere-smoke/60">
                Formato: Calle, Carrera, Avenida, etc. + número
              </p>
            )}
          </label>
        </div>

        {error && (
          <p className="mt-6 text-xs uppercase tracking-[0.12em] text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="mt-10 w-full bg-riviere-ink text-white hover:bg-riviere-ink/90 disabled:opacity-50"
        >
          {loading ? "Procesando..." : `Pagar ${COP.format(total)} con Wompi`}
        </Button>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-riviere-smoke/70">
          Serás redirigido a Wompi para completar el pago de forma segura
        </p>
      </div>
    </form>
  );
}
