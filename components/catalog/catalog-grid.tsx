"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CatalogFilters,
  type CatalogFilterState,
} from "@/components/catalog/catalog-filters";
import { ProductCard } from "@/components/catalog/product-card";
import { getProductStyleCategory } from "@/src/lib/product-display";
import type { MergedProduct } from "@/src/lib/products-store";

type CatalogGridProps = {
  products: MergedProduct[];
};

const initialFilters: CatalogFilterState = {
  search: "",
  color: "all",
  estiloCategoria: "all",
  talla: "all",
  mangaCorta: "all",
  sort: "default",
  oferta: false,
};

const tallaOrder = ["S", "S-M", "M", "M-L", "L", "L-XL", "XL", "XL-XXL", "XXL"];
const productsPerPage = 8;

type FilterKey = keyof Pick<
  CatalogFilterState,
  "search" | "color" | "estiloCategoria" | "talla" | "mangaCorta"
>;

function getFilteredProducts(
  products: MergedProduct[],
  filters: CatalogFilterState,
  ignoredFilter?: FilterKey,
) {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      ignoredFilter === "search" ||
      !normalizedSearch ||
      product.estilo.toLowerCase().includes(normalizedSearch) ||
      product.nombre.toLowerCase().includes(normalizedSearch);
    const matchesColor =
      ignoredFilter === "color" ||
      filters.color === "all" ||
      product.colores.includes(filters.color);
    const matchesEstilo =
      ignoredFilter === "estiloCategoria" ||
      filters.estiloCategoria === "all" ||
      getProductStyleCategory(product) === filters.estiloCategoria;
    const matchesTalla =
      ignoredFilter === "talla" ||
      filters.talla === "all" ||
      product.tallas.includes(filters.talla);
    const matchesManga =
      ignoredFilter === "mangaCorta" ||
      filters.mangaCorta === "all" ||
      String(product.mangaCorta) === filters.mangaCorta;

    const matchesOferta =
      !filters.oferta || (product.dcto !== null && product.dcto > 0);

    return (
      matchesSearch &&
      matchesColor &&
      matchesEstilo &&
      matchesTalla &&
      matchesManga &&
      matchesOferta
    );
  });
}

function sortTallas(left: string, right: string) {
  const leftIndex = tallaOrder.indexOf(left);
  const rightIndex = tallaOrder.indexOf(right);

  if (leftIndex === -1 || rightIndex === -1) {
    return left.localeCompare(right);
  }

  return leftIndex - rightIndex;
}

export function CatalogGrid({ products }: CatalogGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<CatalogFilterState>(() => ({
    ...initialFilters,
    estiloCategoria: searchParams.get("estilo") ?? "all",
    search: searchParams.get("q") ?? "",
    oferta: searchParams.get("oferta") === "true",
  }));
  const [visibleCount, setVisibleCount] = useState(productsPerPage);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, oferta: searchParams.get("oferta") === "true" }));
    setVisibleCount(productsPerPage);
  }, [searchParams]);

  const handleFilterChange = (nextFilters: CatalogFilterState) => {
    setFilters(nextFilters);
    setVisibleCount(productsPerPage);
  };

  function clearOferta() {
    handleFilterChange({ ...filters, oferta: false });
    router.replace("/catalogo", { scroll: false });
  }

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          getFilteredProducts(products, filters, "color").flatMap(
            (product) => product.colores,
          ),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [filters, products],
  );

  const tallas = useMemo(
    () =>
      Array.from(
        new Set(
          getFilteredProducts(products, filters, "talla").flatMap(
            (product) => product.tallas,
          ),
        ),
      ).sort(sortTallas),
    [filters, products],
  );

  const estilos = useMemo(
    () =>
      Array.from(
        new Set(
          getFilteredProducts(products, filters, "estiloCategoria").map(
            getProductStyleCategory,
          ),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [filters, products],
  );

  const mangas = useMemo(
    () =>
      Array.from(
        new Set(
          getFilteredProducts(products, filters, "mangaCorta").map((product) =>
            String(product.mangaCorta),
          ),
        ),
      ),
    [filters, products],
  );

  const filteredProducts = useMemo(() => {
    const result = getFilteredProducts(products, filters);

    if (filters.sort === "price-asc") {
      return [...result].sort((left, right) => left.precio - right.precio);
    }

    if (filters.sort === "price-desc") {
      return [...result].sort((left, right) => right.precio - left.precio);
    }

    return result;
  }, [filters, products]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;

  return (
    <section className="bg-riviere-bone pb-24">
      <div className="container">
        <CatalogFilters
          filters={filters}
          colors={colors}
          estilos={estilos}
          tallas={tallas}
          mangas={mangas}
          onChange={handleFilterChange}
        />

        {filters.oferta && (
          <div className="mt-6 flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.16em] text-riviere-smoke">
              Mostrando:
            </span>
            <button
              type="button"
              onClick={clearOferta}
              className="flex items-center gap-2 border border-riviere-ink/30 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-riviere-ink transition hover:bg-riviere-ink hover:text-white"
            >
              Ofertas
              <span className="text-[13px] leading-none">×</span>
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-riviere-smoke">
          <p>{filteredProducts.length} productos</p>
          <p>{products.length} piezas exclusivas</p>
        </div>

        {filteredProducts.length > 0 ? (
          <>
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMoreProducts ? (
              <div className="mt-14 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setVisibleCount((count) => count + productsPerPage)
                  }
                >
                  Ver mas
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-14 border-y border-riviere-ink/10 py-16 text-center">
            <p className="text-sm uppercase tracking-[0.18em] text-riviere-smoke">
              Sin resultados para esta selección
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
