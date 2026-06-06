"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CatalogFilters,
  type CatalogFilterState,
} from "@/components/catalog/catalog-filters";
import { ProductCard } from "@/components/catalog/product-card";
import { getProductDesign } from "@/src/lib/product-display";
import type { Product } from "@/src/types/product";

type CatalogGridProps = {
  products: Product[];
};

const initialFilters: CatalogFilterState = {
  search: "",
  color: "all",
  diseno: "all",
  talla: "all",
  mangaCorta: "all",
  sort: "default",
};

const tallaOrder = ["XS", "S", "M", "L", "XL", "XXL"];
const productsPerPage = 8;

export function CatalogGrid({ products }: CatalogGridProps) {
  const [filters, setFilters] = useState<CatalogFilterState>(initialFilters);
  const [visibleCount, setVisibleCount] = useState(productsPerPage);

  const handleFilterChange = (nextFilters: CatalogFilterState) => {
    setFilters(nextFilters);
    setVisibleCount(productsPerPage);
  };

  const colors = useMemo(
    () =>
      Array.from(new Set(products.flatMap((product) => product.colores))).sort(
        (left, right) => left.localeCompare(right),
      ),
    [products],
  );

  const tallas = useMemo(
    () =>
      Array.from(new Set(products.flatMap((product) => product.tallas))).sort(
        (left, right) => tallaOrder.indexOf(left) - tallaOrder.indexOf(right),
      ),
    [products],
  );

  const disenos = useMemo(
    () =>
      Array.from(new Set(products.map(getProductDesign))).sort((left, right) =>
        left.localeCompare(right),
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch = product.estilo
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesColor =
        filters.color === "all" || product.colores.includes(filters.color);
      const matchesDiseno =
        filters.diseno === "all" || getProductDesign(product) === filters.diseno;
      const matchesTalla =
        filters.talla === "all" || product.tallas.includes(filters.talla);
      const matchesManga =
        filters.mangaCorta === "all" ||
        String(product.mangaCorta) === filters.mangaCorta;

      return (
        matchesSearch &&
        matchesColor &&
        matchesDiseno &&
        matchesTalla &&
        matchesManga
      );
    });

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
          disenos={disenos}
          tallas={tallas}
          onChange={handleFilterChange}
        />

        <div className="mt-8 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-riviere-smoke">
          <p>{filteredProducts.length} productos</p>
          <p>{products.length} piezas editadas</p>
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
              Sin resultados para esta seleccion
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
