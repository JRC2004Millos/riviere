"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/src/context/cart-context";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Colección", href: "/#coleccion" },
  { label: "Contacto", href: "/#contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { totalItems } = useCart();

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 40);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  function submitSearch() {
    const q = searchQuery.trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
    closeSearch();
    setOpen(false);
  }


  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-riviere-ink/10 bg-white/92 text-[#111] backdrop-blur-sm">
      <nav className="container grid h-20 grid-cols-[1fr_auto_1fr] items-center">

        {/* Izquierda desktop: links de navegación */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.28em] text-[#111]/75 transition hover:text-[#111]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Izquierda mobile: hamburguesa */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-start md:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Centro: logo */}
        <Link href="/" className="relative block h-12 w-16" aria-label="RIVIERE home">
          <Image
            src="/images/Rivie png.png"
            alt="RIVIERE"
            fill
            sizes="64px"
            className="object-contain"
          />
        </Link>

        {/* Derecha desktop: búsqueda + carrito */}
        <div className="hidden items-center justify-end gap-5 md:flex">
          <form onSubmit={(e) => { e.preventDefault(); submitSearch(); }} className="flex items-center gap-2">
            <div
              style={{
                width: searchOpen ? "180px" : "0px",
                overflow: "hidden",
                transition: "width 0.28s ease",
              }}
            >
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}
                onBlur={() => { if (!searchQuery.trim()) closeSearch(); }}
                placeholder="Nombre o código..."
                style={{ width: "180px" }}
                className="border-b border-riviere-ink/25 bg-transparent pb-1 text-xs outline-none tracking-[0.08em] placeholder:text-riviere-smoke/40"
                aria-label="Buscar productos"
              />
            </div>
            {/* Siempre type="button" — el form onSubmit maneja el Enter */}
            <button
              type="button"
              onClick={() => (searchOpen ? submitSearch() : openSearch())}
              aria-label="Buscar"
              className="flex-shrink-0 transition-opacity hover:opacity-60"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <Link href="/carrito" aria-label="Carrito" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-riviere-ink text-[9px] leading-none text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Derecha mobile: carrito como ícono */}
        <div className="flex items-center justify-end md:hidden">
          <Link href="/carrito" aria-label="Carrito" className="relative inline-flex h-10 w-10 items-center justify-center">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-riviere-ink text-[9px] leading-none text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Menú mobile desplegable */}
      <div
        className={cn(
          "grid overflow-hidden border-t border-riviere-ink/10 bg-white transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="container flex flex-col gap-5 py-6">
            {/* Búsqueda mobile */}
            <form
              onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
              className="flex items-center gap-3 border-b border-riviere-ink/10 pb-5"
            >
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-riviere-smoke/50" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por nombre o código..."
                className="w-full bg-transparent text-sm outline-none tracking-[0.1em] placeholder:text-riviere-smoke/40"
                aria-label="Buscar productos"
              />
            </form>

            {/* Links — sin Carrito (está como ícono en la navbar) */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-[0.2em] text-[#111]/78"
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
