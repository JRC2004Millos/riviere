"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Colección", href: "/#coleccion" },
  { label: "Valores", href: "/#valores" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-riviere-ink/10 bg-riviere-bone/96 text-riviere-ink backdrop-blur-md">
      <nav className="container grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.2em] text-riviere-ink/70 transition hover:text-riviere-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-start md:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          href="/"
          className="relative block h-16 w-40"
          aria-label="RIVIERE home"
        >
          <Image
            src="/images/Rivie bien PNG.png"
            alt="RIVIERE"
            fill
            sizes="160px"
            className="object-contain"
          />
        </Link>

        <div className="hidden items-center justify-end gap-5 md:flex">
          <Link
            href="/#valores"
            className="text-xs uppercase tracking-[0.2em] text-riviere-ink/70 transition hover:text-riviere-ink"
          >
            Contacto
          </Link>
          <Link href="/catalogo" aria-label="Buscar">
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/login" aria-label="Login">
            <User className="h-4 w-4" />
          </Link>
          <Link href="/carrito" aria-label="Carrito">
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <div
        className={cn(
          "grid overflow-hidden border-t border-riviere-ink/10 bg-riviere-bone transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="container flex flex-col gap-5 py-6">
            {[
              ...navItems,
              { label: "Login", href: "/login" },
              { label: "Carrito", href: "/carrito" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-[0.2em] text-riviere-ink/78"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
