"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Action = "deliver" | "cancel";

type Props = {
  orderId: string;
};

export function PedidoActions({ orderId }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const openDialog = (nextAction: Action) => {
    setAction(nextAction);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setAction(null);
  };

  const runAction = () => {
    if (!action || pending) return;

    setPending(true);
    fetch(`/api/admin/pedidos/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("bad");
        closeDialog();
        setToast(action === "deliver" ? "Pedido entregado." : "Pedido cancelado.");
        router.refresh();
      })
      .catch(() => {
        closeDialog();
        setToast("No se pudo actualizar el pedido.");
      })
      .finally(() => {
        setPending(false);
        window.setTimeout(() => setToast(null), 2500);
      });
  };

  const title = action === "deliver" ? "¿Entregar pedido?" : "¿Cancelar pedido?";
  const text =
    action === "deliver"
      ? "¿Estás seguro de que deseas marcar este pedido como entregado?"
      : "¿Estás seguro de que deseas cancelar este pedido?";
  const cancelLabel = action === "deliver" ? "Cancelar" : "Volver";
  const confirmLabel = action === "deliver" ? "Sí, entregar" : "Sí, cancelar";

  return (
    <>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => openDialog("deliver")}
        >
          Entregar pedido
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => openDialog("cancel")}
        >
          Cancelar pedido
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-none border border-riviere-ink/10 bg-white p-0 backdrop:bg-black/40"
        onClose={() => setAction(null)}
      >
        <div className="px-6 py-5">
          <h2 className="text-lg font-medium text-riviere-ink">{title}</h2>
          <p className="mt-2 text-sm text-riviere-smoke">{text}</p>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={closeDialog}>
              {cancelLabel}
            </Button>
            <Button type="button" size="sm" disabled={pending} onClick={runAction}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </dialog>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 border border-riviere-ink/10 bg-white px-4 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
