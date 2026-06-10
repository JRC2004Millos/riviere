"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { getProductImage } from "@/src/lib/product-images";

type SortProduct = {
  id: string;
  estilo: string;
  nombre: string;
  hasImage: boolean;
};

function SortableItem({
  product,
  index,
}: {
  product: SortProduct;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 border border-riviere-ink/10 bg-white px-4 py-3"
    >
      <button
        type="button"
        className="flex cursor-grab touch-none flex-col gap-[3px] p-1 text-riviere-smoke/40 hover:text-riviere-smoke active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Arrastrar para reordenar"
      >
        <span className="block h-[2px] w-4 bg-current" />
        <span className="block h-[2px] w-4 bg-current" />
        <span className="block h-[2px] w-4 bg-current" />
      </button>

      <span className="w-6 text-center text-xs tabular-nums text-riviere-smoke/40">
        {index + 1}
      </span>

      <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden bg-riviere-stone">
        {product.hasImage && (
          <Image
            src={getProductImage(product.estilo)}
            alt={product.estilo}
            fill
            sizes="36px"
            className="object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium tracking-wide">
          {product.nombre || product.estilo}
        </p>
        <p className="text-xs uppercase tracking-[0.14em] text-riviere-smoke">
          {product.estilo}
        </p>
      </div>
    </div>
  );
}

export function ProductSortList({ products: initial }: { products: SortProduct[] }) {
  const [products, setProducts] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProducts((items) => {
      const oldIndex = items.findIndex((p) => p.id === active.id);
      const newIndex = items.findIndex((p) => p.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    setStatus("idle");
  }

  const handleSave = useCallback(async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/orden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: products.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error("error");
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }, [products]);

  return (
    <div className="space-y-4">
      {status === "saved" && (
        <div className="border-l-2 border-emerald-600 bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
            Orden guardado correctamente
          </p>
        </div>
      )}
      {status === "error" && (
        <div className="border-l-2 border-red-500 bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-red-600">
            Error al guardar. Intenta de nuevo.
          </p>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {products.map((product, index) => (
              <SortableItem key={product.id} product={product} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="border-riviere-ink bg-riviere-ink text-white hover:bg-riviere-ink/85 disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar orden"}
        </Button>
      </div>
    </div>
  );
}
