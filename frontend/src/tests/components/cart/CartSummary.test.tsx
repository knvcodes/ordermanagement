import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CartSummary from "../../../components/cart/CartSummary";
import { useCartStore } from "../../../store/cartStore";
import { useUiStore } from "../../../store/uiStore";
import type { MenuItem2 } from "../../../utils/types";

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockMenuItem: MenuItem2 = {
  _id: "burger-001",
  name: "Classic Burger",
  description: "Beef patty with lettuce and tomato",
  price: 1000,
  category: "Burger",
  image: "/images/burger.jpg",
  isAvailable: true,
  __v: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("CartSummary", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useUiStore.setState({ isCartOpen: true });
    navigateMock.mockClear();
  });

  it("renders summary labels and empty-cart totals", () => {
    render(<CartSummary />);

    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("Delivery Fee")).toBeInTheDocument();
    expect(screen.getByText("Tax (8%)")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();

    // Subtotal and tax are both $0.00 when the cart is empty.
    expect(screen.getAllByText("$0.00")).toHaveLength(2);

    // Delivery fee is always applied.
    expect(screen.getAllByText("$2.99")).toHaveLength(2);
  });

  it("calculates and displays totals for one item", () => {
    useCartStore.getState().addItem(mockMenuItem);

    render(<CartSummary />);

    // subtotal $10.00 + delivery $2.99 + tax $0.80 = $13.79
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("$0.80")).toBeInTheDocument();
    expect(screen.getByText("$13.79")).toBeInTheDocument();
  });

  it("calculates and displays totals after adding the same item twice", () => {
    useCartStore.getState().addItem(mockMenuItem);
    useCartStore.getState().addItem(mockMenuItem);

    render(<CartSummary />);

    // subtotal $20.00 + delivery $2.99 + tax $1.60 = $24.59
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("$1.60")).toBeInTheDocument();
    expect(screen.getByText("$24.59")).toBeInTheDocument();
  });

  it("navigates to checkout and closes the cart drawer", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addItem(mockMenuItem);

    render(<CartSummary />);

    const checkoutButton = screen.getByRole("button", {
      name: /proceed to checkout/i,
    });

    await user.click(checkoutButton);

    expect(navigateMock).toHaveBeenCalledWith("/checkout");
    expect(useUiStore.getState().isCartOpen).toBe(false);
  });
});
