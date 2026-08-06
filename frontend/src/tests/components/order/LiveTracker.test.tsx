import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LiveTracker from "@/components/order/LiveTracker";

const order = { _id: "order", userId: "user", totalAmount: 1000, status: "PREPARING" as const, delivery: { name: "Ada", phone: "1", address: "Street" }, createdAt: "", updatedAt: "", __v: 0, items: [] };

describe("LiveTracker", () => {
  it("shows the readable current status and live indicator", () => {
    const { container } = render(<LiveTracker order={order} />);
    expect(screen.getByText("Preparing")).toBeInTheDocument();
    expect(container.querySelector(".live-tracker-dot-ping")).toBeInTheDocument();
  });

  it("stops the live indicator for delivered orders", () => {
    const { container } = render(<LiveTracker order={{ ...order, status: "DELIVERED" }} />);
    expect(container.querySelector(".live-tracker-dot-ping")).not.toBeInTheDocument();
  });
});
