import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import MenuGrid from "@/components/menu/MenuGrid";
import { useCartStore } from "@/store/cartStore";

const items = [
  { _id: "pizza", name: "Pizza", description: "Cheesy", price: 1000, image: "", category: "Pizza", isAvailable: true, __v: 0, createdAt: "", updatedAt: "" },
  { _id: "burger", name: "Burger", description: "Juicy", price: 900, image: "", category: "Burger", isAvailable: true, __v: 0, createdAt: "", updatedAt: "" },
];

describe("MenuGrid", () => {
  beforeEach(() => useCartStore.setState({ items: [] }));

  it("renders only items matching the selected category", () => {
    render(<MenuGrid items={items} selectedCategory="Pizza" />);
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.queryByText("Burger")).not.toBeInTheDocument();
  });

  it("shows an empty state when no items match", () => {
    render(<MenuGrid items={items} selectedCategory="Dessert" />);
    expect(screen.getByText("No dishes found")).toBeInTheDocument();
  });
});
