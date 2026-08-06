import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Header from "@/components/layout/Header";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

describe("Header", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useUiStore.setState({ isCartOpen: false, isMobileMenuOpen: false });
  });

  it("shows the cart quantity and opens the cart", async () => {
    useCartStore.setState({ items: [{ _id: "pizza", name: "Pizza", description: "", price: 1000, image: "", category: "Pizza", isAvailable: true, __v: 0, createdAt: "", updatedAt: "", quantity: 2 }] });
    const user = userEvent.setup();
    render(<Header />, { wrapper: MemoryRouter });

    expect(screen.getByText("2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open cart" }));
    expect(useUiStore.getState().isCartOpen).toBe(true);
  });

  it("opens and closes the mobile navigation", async () => {
    const user = userEvent.setup();
    render(<Header />, { wrapper: MemoryRouter });

    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getAllByRole("link", { name: "Track" })).toHaveLength(2);
    await user.click(screen.getAllByRole("link", { name: "Track" })[1]);
    expect(useUiStore.getState().isMobileMenuOpen).toBe(false);
  });
});
