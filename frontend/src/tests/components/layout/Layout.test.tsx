import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Layout from "@/components/layout/Layout";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

describe("Layout", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useUiStore.setState({ isCartOpen: false, isMobileMenuOpen: false, toasts: [] });
  });

  it("wraps page content with the shared header and footer", () => {
    render(<Layout><p>Page content</p></Layout>, { wrapper: MemoryRouter });

    expect(screen.getByRole("main")).toHaveTextContent("Page content");
    expect(screen.getAllByText("FoodDash")).toHaveLength(2);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
