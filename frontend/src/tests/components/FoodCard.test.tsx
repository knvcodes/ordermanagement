import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import FoodCard from "@/components/menu/FoodCard";
import { useCartStore } from "@/store/cartStore";
import type { MenuItem } from "@/utils/types";

const mockItem: MenuItem = {
  id: "pizza-001",
  name: "Margherita Pizza",
  description: "Fresh mozzarella, tomato, and basil",
  price: 1299,
  category: "Pizza",
  image: "/images/margherita.jpg",
  rating: 4.7,
  prepTime: 20,
};

describe("FoodCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("renders the food item name and formatted price", () => {
    render(
      <MemoryRouter>
        <FoodCard item={mockItem} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
  });

  it("adds the item to the cart when Add to Cart is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FoodCard item={mockItem} />
      </MemoryRouter>,
    );

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addButton);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("pizza-001");
    expect(items[0].quantity).toBe(1);
  });
});
