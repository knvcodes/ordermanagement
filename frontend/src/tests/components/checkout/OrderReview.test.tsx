import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import OrderReview from "@/components/checkout/OrderReview";
import { useCartStore } from "@/store/cartStore";

describe("OrderReview", () => {
  beforeEach(() => useCartStore.setState({ items: [] }));

  it("lists cart items and calculates the complete order total", () => {
    useCartStore.setState({ items: [{ _id: "pizza", name: "Margherita", description: "", price: 1200, image: "", category: "Pizza", isAvailable: true, __v: 0, createdAt: "", updatedAt: "", quantity: 2 }] });
    render(<OrderReview />);

    expect(screen.getByText("2×")).toBeInTheDocument();
    expect(screen.getByText("Margherita")).toBeInTheDocument();
    expect(screen.getAllByText("$24.00")).toHaveLength(2);
    expect(screen.getByText("$1.92")).toBeInTheDocument();
    expect(screen.getByText("$28.91")).toBeInTheDocument();
  });
});
