import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import FoodCard from "@/components/menu/FoodCard";
import { useCartStore } from "@/store/cartStore";
import type { MenuItem2 } from "@/utils/types";

const mockItem: MenuItem2 = {
  _id: "pizza-001",
  name: "Margherita Pizza",
  description: "Fresh mozzarella, tomato, and basil",
  price: 1299,
  category: "Pizza",
  image: "/images/margherita.jpg",
  isAvailable: true,
  __v: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("FoodCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("renders the food item name and formatted price", () => {
    render(<FoodCard item={mockItem} />);

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
  });

  it("adds the item to the cart when Add to Cart is clicked", async () => {
    const user = userEvent.setup();
    render(<FoodCard item={mockItem} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addButton);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]._id).toBe("pizza-001");
    expect(items[0].quantity).toBe(1);
  });
});
