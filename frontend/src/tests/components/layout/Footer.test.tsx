import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Footer from "@/components/layout/Footer";

describe("Footer", () => {
  it("renders the brand and navigation links", () => {
    render(<Footer />, { wrapper: MemoryRouter });

    expect(screen.getByText("FoodDash")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("href", "/orders");
    expect(screen.getByRole("link", { name: "Track Order" })).toHaveAttribute("href", "/track");
  });
});
