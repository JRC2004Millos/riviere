"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SortValue = "default" | "price-asc" | "price-desc";

export type CatalogFilterState = {
  search: string;
  color: string;
  estiloCategoria: string;
  talla: string;
  mangaCorta: string;
  sort: SortValue;
};

type CatalogFiltersProps = {
  filters: CatalogFilterState;
  colors: string[];
  estilos: string[];
  tallas: string[];
  mangas: string[];
  onChange: (filters: CatalogFilterState) => void;
};

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
      <button
        type="button"
        className="flex w-full items-center justify-between text-xs uppercase tracking-[0.18em] text-riviere-ink md:hidden"
        onClick={() => setOpen((value) => !value)}
      >
        Filtros
        <SlidersHorizontal className="h-4 w-4" />
      </button>

      <div
        className={cn(
          "grid gap-4 md:grid md:grid-cols-6",
          open ? "mt-6 grid" : "hidden md:grid",
        )}
      >
        <label className="block md:col-span-1">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Buscar
          </span>
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="S13"
            className="mt-3 h-11 w-full border border-riviere-ink/12 bg-transparent px-3 text-sm outline-none transition focus:border-riviere-ink"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Estilo
          </span>
          <select
            value={filters.estiloCategoria}
            onChange={(event) =>
              updateFilter("estiloCategoria", event.target.value)
            }
            className="mt-3 h-11 w-full border border-riviere-ink/12 bg-transparent px-3 text-sm outline-none transition focus:border-riviere-ink"
          >
            <option value="all">Todos</option>
            {estilos.map((estilo) => (
              <option key={estilo} value={estilo}>
                {estilo}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Color
          </span>
          <select
            value={filters.color}
            onChange={(event) => updateFilter("color", event.target.value)}
            className="mt-3 h-11 w-full border border-riviere-ink/12 bg-transparent px-3 text-sm outline-none transition focus:border-riviere-ink"
          >
            <option value="all">Todos</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Manga
          </span>
          <select
            value={filters.mangaCorta}
            onChange={(event) => updateFilter("mangaCorta", event.target.value)}
            className="mt-3 h-11 w-full border border-riviere-ink/12 bg-transparent px-3 text-sm outline-none transition focus:border-riviere-ink"
          >
            <option value="all">Todas</option>
            {mangas.includes("true") ? (
              <option value="true">Manga corta</option>
            ) : null}
            {mangas.includes("false") ? (
              <option value="false">Manga larga</option>
            ) : null}
          </select>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Talla
          </span>
          <select
            value={filters.talla}
            onChange={(event) => updateFilter("talla", event.target.value)}
            className="mt-3 h-11 w-full border border-riviere-ink/12 bg-transparent px-3 text-sm outline-none transition focus:border-riviere-ink"
          >
            <option value="all">Todas</option>
            {tallas.map((talla) => (
              <option key={talla} value={talla}>
                {talla}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-riviere-smoke">
            Orden
          </span>
          <select
            value={filters.sort}
            onChange={(event) =>
              updateFilter("sort", event.target.value as SortValue)
            }
            className="mt-3 h-11 w-full border border-riviere-ink/12 bg-transparent px-3 text-sm outline-none transition focus:border-riviere-ink"
          >
            <option value="default">Editorial</option>
            <option value="price-asc">Precio menor a mayor</option>
            <option value="price-desc">Precio mayor a menor</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
