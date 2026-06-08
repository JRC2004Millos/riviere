"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { getProductImage } from "@/src/lib/product-images";
import { getProductCatalogStatus } from "@/src/lib/product-display";
import type { MergedProduct } from "@/src/lib/products-store";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

type ProductCardProps = {
  product: MergedProduct;
};

function ProductCardComponent({ product }: ProductCardProps) {
  const catalogStatus = getProductCatalogStatus(product);

  return (
    <article className="group">
      <Link
        href={`/producto/${product.estilo.toLowerCase()}`}
        className="block"
        aria-label={`Ver producto ${product.estilo}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-riviere-stone">
          <Image
            src={getProductImage(product.estilo)}
            alt={`Camisa RIVIERE estilo ${product.estilo}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.025]"
          />
        </div>
      </Link>

      <div className="border-b border-riviere-ink/12 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.18em]">
              {product.nombre || product.estilo}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-riviere-smoke">
              {product.estilo}
            </p>
          </div>
          <p className="text-sm text-riviere-ink">
            {currencyFormatter.format(product.precio)}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.14em] text-riviere-smoke">
            {catalogStatus}
          </p>
          <Button asChild variant="ghost" size="sm" className="px-0 hover:bg-transparent">
            <Link href={`/producto/${product.estilo.toLowerCase()}`}>
              Ver producto
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
