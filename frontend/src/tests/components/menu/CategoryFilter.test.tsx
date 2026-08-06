import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CategoryFilter from "@/components/menu/CategoryFilter";

describe("CategoryFilter", () => {
  it("marks the selected category and reports category changes", async () => {
    const onSelectCategory = vi.fn();
    const user = userEvent.setup();
    render(<CategoryFilter selectedCategory="Pizza" onSelectCategory={onSelectCategory} />);

    expect(screen.getByRole("tab", { name: "Pizza" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Burger" }));
    expect(onSelectCategory).toHaveBeenCalledWith("Burger");
  });
});
