import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusTimeline from "@/components/order/StatusTimeline";

describe("StatusTimeline", () => {
  it("marks earlier steps complete and the current one active", () => {
    const { container } = render(<StatusTimeline status="PREPARING" />);
    expect(screen.getByText("Order Received")).toBeInTheDocument();
    expect(container.querySelector(".status-step-circle-completed")).toHaveTextContent("✓");
    expect(container.querySelector(".status-step-circle-active")).toHaveTextContent("2");
  });

  it("renders the cancellation state", () => {
    render(<StatusTimeline status="CANCELLED" />);
    expect(screen.getByText("Order Cancelled")).toBeInTheDocument();
  });
});
