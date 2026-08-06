import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EmptyState from "@/components/common/EmptyState";

describe("EmptyState", () => {
  it("shows optional content and invokes its action", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(<EmptyState title="No orders" description="Place an order to see it here." actionLabel="Browse menu" onAction={onAction} />);

    expect(screen.getByText("No orders")).toBeInTheDocument();
    expect(screen.getByText("Place an order to see it here.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Browse menu" }));
    expect(onAction).toHaveBeenCalledOnce();
  });
});
