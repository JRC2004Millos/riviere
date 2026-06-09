"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  code: number;
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ code, message, onRetry }: Props) {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-[#111]">
      <p className="text-[7rem] font-light leading-none tracking-tight text-riviere-ink/10 select-none md:text-[10rem]">
        {code}
      </p>

      <div className="relative -mt-6 h-48 w-48 md:h-64 md:w-64">
        <Image
          src="/images/Rivie sorprendido.png"
          alt="Rivie sorprendido"
          fill
          priority
          className="object-contain"
        />
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.28em] text-riviere-smoke">
        {message}
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="w-44 border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
        >
          ← Volver
        </Button>

        {onRetry && (
          <Button
            size="lg"
            onClick={onRetry}
            className="w-44 bg-riviere-ink text-white hover:bg-riviere-ink/85"
          >
            Reintentar
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-44 border-riviere-ink/30 text-riviere-ink hover:bg-riviere-ink hover:text-white"
        >
          <Link href="/">Inicio</Link>
        </Button>
      </div>
    </main>
  );
}
