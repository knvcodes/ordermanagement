import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import OrderCard from "@/components/order/OrderCard";

function Location() { return <output>{useLocation().pathname + useLocation().search}</output>; }

const order = { _id: "order-42", userId: "user", totalAmount: 2599, status: "OUT_FOR_DELIVERY" as const, delivery: { name: "Ada", phone: "1", address: "Street" }, createdAt: "2026-01-05T12:30:00.000Z", updatedAt: "", __v: 0, items: [{ _id: "item", orderId: "order-42", menuItemId: "pizza", itemName: "Pizza", itemPrice: 1200, quantity: 2, subtotal: 2400, __v: 0, createdAt: "", updatedAt: "" }] };

describe("OrderCard", () => {
  it("shows order details and opens the corresponding tracker", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><OrderCard order={order} /><Location /></MemoryRouter>);

    expect(screen.getByText("order-42")).toBeInTheDocument();
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
    expect(screen.getByText(/2 items — Pizza/)).toBeInTheDocument();
    expect(screen.getByText("$25.99")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Track" }));
    expect(screen.getByText("/track?orderId=order-42")).toBeInTheDocument();
  });
});
