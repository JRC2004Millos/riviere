"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SortValue = "default" | "price-asc" | "price-desc";

export type CatalogFilterState = {
  search: string;
  color: string;
  estiloCategoria: string;
  talla: string;
  mangaCorta: string;
  sort: SortValue;
  oferta: boolean;
};

type CatalogFiltersProps = {
  filters: CatalogFilterState;
  colors: string[];
  estilos: string[];
  tallas: string[];
  mangas: string[];
  onChange: (filters: CatalogFilterState) => void;
};

const CONTROL_CLS =
  "mt-3 h-11 w-full border border-riviere-ink/12 bg-transparent px-3 text-sm outline-none transition focus:border-riviere-ink";

export function CatalogFilters({
  filters,
  colors,
  estilos,
  tallas,
  mangas,
  onChange,
}: CatalogFiltersProps) {
  const [open, setOpen] = useState(false);

  const updateFilter = <Key extends keyof CatalogFilterState>(
    key: Key,
    value: CatalogFilterState[Key],
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <aside className="border-y border-riviere-ink/10 py-6">
      {/* Toggle solo visible en móvil */}
      <button
        type="button"
        className="flex w-full items-center justify-between text-xs uppercase tracking-[0.18em] text-riviere-ink md:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        Filtros
        <SlidersHorizontal className="h-4 w-4" />
      </button>

      {/*
        Móvil (abierto): grid 2 columnas → 3 en sm
        Desktop (md+): flex fila única, siempre visible
      */}
      <div
        className={cn(
          "md:flex md:flex-row md:items-start md:gap-3",
          open ? "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" : "hidden",
        )}
      >
        {/* Buscar */}
        <label className="block flex-[2]">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Buscar
          </span>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-riviere-smoke/50" />
            <input
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Buscar"
              className="h-11 w-full border border-riviere-ink/12 bg-transparent pl-8 pr-3 text-sm outline-none transition focus:border-riviere-ink"
            />
          </div>
        </label>

        {/* Estilo */}
        <label className="block flex-[2]">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Estilo
          </span>
          <select
            value={filters.estiloCategoria}
            onChange={(e) => updateFilter("estiloCategoria", e.target.value)}
            className={CONTROL_CLS}
          >
            <option value="all">Todos</option>
            {estilos.map((estilo) => (
              <option key={estilo} value={estilo}>
                {estilo}
              </option>
            ))}
          </select>
        </label>

        {/* Color */}
        <label className="block flex-1">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Color
          </span>
          <select
            value={filters.color}
            onChange={(e) => updateFilter("color", e.target.value)}
            className={CONTROL_CLS}
          >
            <option value="all">Todos</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>

        {/* Manga */}
        <label className="block flex-1">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Manga
          </span>
          <select
            value={filters.mangaCorta}
            onChange={(e) => updateFilter("mangaCorta", e.target.value)}
            className={CONTROL_CLS}
          >
            <option value="all">Todas</option>
            {mangas.includes("true") && <option value="true">Corta</option>}
            {mangas.includes("false") && <option value="false">Larga</option>}
          </select>
        </label>

        {/* Talla */}
        <label className="block flex-1">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Talla
          </span>
          <select
            value={filters.talla}
            onChange={(e) => updateFilter("talla", e.target.value)}
            className={CONTROL_CLS}
          >
            <option value="all">Todas</option>
            {tallas.map((talla) => (
              <option key={talla} value={talla}>
                {talla}
              </option>
            ))}
          </select>
          <Link
            href="/guia-de-tallas"
            className="mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-riviere-smoke/60 transition-colors hover:text-riviere-ink"
          >
            Guía de tallas →
          </Link>
        </label>

        {/* Orden */}
        <label className="block flex-[2]">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Orden
          </span>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value as SortValue)}
            className={CONTROL_CLS}
          >
            <option value="default">Recomendado</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
