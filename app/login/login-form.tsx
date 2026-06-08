"use client";
import { useActionState } from "react";
import { authenticate } from "./actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full border-b border-riviere-ink/20 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-riviere-ink placeholder:text-riviere-smoke/40";

export function LoginForm() {
  const [error, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="username"
          className="text-xs uppercase tracking-[0.22em] text-riviere-smoke"
        >
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-xs uppercase tracking-[0.22em] text-riviere-smoke"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-xs uppercase tracking-[0.16em] text-red-600">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="mt-1 border-riviere-ink bg-riviere-ink text-white hover:bg-riviere-ink/85"
      >
        {isPending ? "Verificando..." : "Ingresar"}
      </Button>
    </form>
  );
}
