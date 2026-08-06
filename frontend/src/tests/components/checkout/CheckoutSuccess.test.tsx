import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CheckoutSuccess from "@/components/checkout/CheckoutSuccess";

function Location() {
  return <output>{useLocation().pathname + useLocation().search}</output>;
}

describe("CheckoutSuccess", () => {
  it("shows confirmation details and provides navigation actions", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CheckoutSuccess order={{ _id: "order-123", userId: "user", totalAmount: 2599, status: "ORDER_RECEIVED", createdAt: "", updatedAt: "" }} /><Location /></MemoryRouter>);

    expect(screen.getByText("Order Confirmed!")).toBeInTheDocument();
    expect(screen.getByText("order-123")).toBeInTheDocument();
    expect(screen.getByText("$25.99")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Track Order" }));
    expect(screen.getByText("/track?orderId=order-123")).toBeInTheDocument();
  });
});
