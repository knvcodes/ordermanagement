import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import type { CartItem, MenuItem2 } from "@/utils/types";

export interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
  addItem: (menuItem: MenuItem2) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  hasItem: (itemId: string) => boolean;
}

export function useCart(): UseCartReturn {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty: items.length === 0,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    hasItem: (itemId: string) => items.some((item) => item._id === itemId),
  };
}
