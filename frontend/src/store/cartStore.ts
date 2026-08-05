import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem2 } from "../utils/types";

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem2) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem) =>
        set((state) => {
          const existing = state.items.find((i) => i._id === menuItem._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...menuItem, quantity: 1 }] };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i._id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i._id !== itemId) };
          }
          return {
            items: state.items.map((i) =>
              i._id === itemId ? { ...i, quantity } : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "food-delivery-cart" },
  ),
);
