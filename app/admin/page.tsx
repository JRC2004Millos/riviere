import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/src/lib/products-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const productos = await getAllProducts();
  const total = productos.length;
  const disponibles = productos.filter((p) => p.cantidad > 0).length;
  const agotados = total - disponibles;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <main className="min-h-screen bg-riviere-bone pt-20 text-[#111]">
      <div className="container py-14">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-riviere-smoke">
              Panel de administración
            </p>
            <h1 className="text-3xl font-light uppercase tracking-[0.15em]">
              RIVIERE Admin
            </h1>
          </div>
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="outline"
              className="border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
            >
              Cerrar sesión
            </Button>
          </form>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Productos", value: total },
            { label: "Disponibles", value: disponibles },
            { label: "Agotados", value: agotados },
          ].map(({ label, value }) => (
            <div key={label} className="border border-riviere-ink/10 bg-white p-8">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
                {label}
              </p>
              <p className="text-4xl font-light">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border border-riviere-ink/10 bg-white p-6">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
            Accesos rápidos
          </p>
          <Button
            asChild
            variant="outline"
            className="border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
          >
            <Link href="/admin/productos">Gestionar productos →</Link>
          </Button>
        </div>

        <div className="mt-4 border border-riviere-ink/10 bg-white p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-riviere-smoke">
            Sesión activa
          </p>
          <p className="text-sm text-riviere-smoke">
            Usuario:{" "}
            <span className="text-riviere-ink">{session.user?.name}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
