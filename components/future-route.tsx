import Link from "next/link";
import { Button } from "@/components/ui/button";

type FutureRouteProps = {
  title: string;
  description: string;
};

export function FutureRoute({ title, description }: FutureRouteProps) {
  return (
    <main className="min-h-[calc(100svh-17rem)] bg-riviere-bone pt-28">
      <section className="container py-20">
        <p className="text-xs uppercase tracking-[0.24em] text-riviere-smoke">
          Arquitectura preparada
        </p>
        <h1 className="mt-4 text-4xl font-medium uppercase tracking-[0.12em] md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-6 text-riviere-smoke">
          {description}
        </p>
        <Button asChild className="mt-10">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </section>
    </main>
  );
}
