import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/store/cartStore";
import type { MenuItem2 } from "@/utils/types";

const pizza: MenuItem2 = {
  _id: "pizza-001",
  name: "Margherita Pizza",
  description: "Fresh mozzarella, tomato, and basil",
  price: 1200,
  category: "Pizza",
  image: "/images/pizza.jpg",
  isAvailable: true,
  __v: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const salad: MenuItem2 = {
  _id: "salad-001",
  name: "Caesar Salad",
  description: "Romaine, parmesan, and croutons",
  price: 800,
  category: "Salad",
  image: "/images/salad.jpg",
  isAvailable: true,
  __v: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adds an item to an empty cart", () => {
    useCartStore.getState().addItem(pizza);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]._id).toBe("pizza-001");
    expect(items[0].quantity).toBe(1);
  });

  it("increments quantity when adding an item already in the cart", () => {
    useCartStore.getState().addItem(pizza);
    useCartStore.getState().addItem(pizza);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("removes an item from the cart", () => {
    useCartStore.getState().addItem(pizza);
    useCartStore.getState().addItem(salad);
    useCartStore.getState().removeItem("pizza-001");

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]._id).toBe("salad-001");
  });

  it("updates the quantity of an item", () => {
    useCartStore.getState().addItem(pizza);
    useCartStore.getState().updateQuantity("pizza-001", 5);

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("calculates total items and total price", () => {
    useCartStore.getState().addItem(pizza);
    useCartStore.getState().addItem(salad);
    useCartStore.getState().addItem(pizza);

    // pizza qty 2 (1200 * 2) + salad qty 1 (800) = 3200
    expect(useCartStore.getState().getTotalItems()).toBe(3);
    expect(useCartStore.getState().getTotalPrice()).toBe(3200);
  });
});
