import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import type { MenuItem } from "@/utils/types";

const mockItem: MenuItem = {
  id: "burger-001",
  name: "Classic Burger",
  description: "Beef patty with lettuce and tomato",
  price: 1000,
  category: "Burger",
  image: "/images/burger.jpg",
  rating: 4.5,
  prepTime: 15,
};

describe("CartDrawer", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useUiStore.setState({ isCartOpen: false });
  });

  it("displays cart items when the drawer is open", () => {
    useCartStore.getState().addItem(mockItem);
    useUiStore.setState({ isCartOpen: true });

    render(
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Classic Burger")).toBeInTheDocument();
  });

  it("calculates and displays the order total", () => {
    useCartStore.getState().addItem(mockItem);
    useUiStore.setState({ isCartOpen: true });

    render(
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>,
    );

    // subtotal $10.00 + delivery $2.99 + tax $0.80 = $13.79
    expect(screen.getByText("$13.79")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    useCartStore.getState().addItem(mockItem);
    useUiStore.setState({ isCartOpen: true });

    render(
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(useUiStore.getState().isCartOpen).toBe(false);
  });
});
