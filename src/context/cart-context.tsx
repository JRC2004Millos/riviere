"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";

export type CartItem = {
  cartKey: string;  // `${estilo}-${color}-${talla}` o `${estilo}-${talla}`
  id: string;
  estilo: string;
  talla: string;
  color?: string;
  precio: number;
  imagen: string;
  stockMax: number; // snapshot de cantidad disponible al agregar
  cantidad: number; // cantidad en el carrito
};

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; item: Omit<CartItem, "cantidad">; cantidad?: number }
  | { type: "REMOVE"; cartKey: string }
  | { type: "UPDATE_QTY"; cartKey: string; cantidad: number }
  | { type: "CLEAR" };

function reducer(
  state: { items: CartItem[] },
  action: CartAction,
): { items: CartItem[] } {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const qty = action.cantidad ?? 1;
      const exists = state.items.find((i) => i.cartKey === action.item.cartKey);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.cartKey === action.item.cartKey
              ? { ...i, cantidad: Math.min(i.cantidad + qty, i.stockMax) }
              : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { ...action.item, cantidad: Math.min(qty, action.item.stockMax) },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.cartKey !== action.cartKey) };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          i.cartKey === action.cartKey
            ? { ...i, cantidad: Math.min(action.cantidad, i.stockMax) }
            : i,
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  removeItem: (cartKey: string) => void;
  updateQty: (cartKey: string, cantidad: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "riviere_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Filtra items del formato anterior que no tengan cartKey/talla
        const parsed = (JSON.parse(stored) as CartItem[]).filter(
          (i) => i.cartKey && i.talla,
        );
        if (parsed.length) dispatch({ type: "HYDRATE", items: parsed });
      }
    } catch {
      // localStorage unavailable or corrupt
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const totalItems = state.items.reduce((s, i) => s + i.cantidad, 0);
  const subtotal = state.items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        subtotal,
        addItem: (item, cantidad) => dispatch({ type: "ADD", item, cantidad }),
        removeItem: (cartKey) => dispatch({ type: "REMOVE", cartKey }),
        updateQty: (cartKey, cantidad) =>
          dispatch({ type: "UPDATE_QTY", cartKey, cantidad }),
        clearCart: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
