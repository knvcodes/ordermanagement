import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TrackOrderPage from "@/pages/TrackOrderPage";

const { useOrderDetailsDataMock, useOrderSSEMock } = vi.hoisted(() => ({
  useOrderDetailsDataMock: vi.fn(),
  useOrderSSEMock: vi.fn(),
}));

vi.mock("@/service/orders/orders.providers", () => ({
  useOrderDetailsData: useOrderDetailsDataMock,
}));

vi.mock("@/hooks/useSSE", () => ({
  useOrderSSE: useOrderSSEMock,
}));

const order = {
  _id: "1234567890abcdef12345678",
  userId: "user-1",
  totalAmount: 2000,
  status: "PREPARING" as const,
  delivery: {
    name: "Ada Lovelace",
    address: "123 Main Street",
    phone: "555-0100",
  },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  __v: 0,
  items: [
    {
      _id: "item-1",
      orderId: "1234567890abcdef12345678",
      menuItemId: "burger-1",
      itemName: "Classic Burger",
      itemPrice: 1000,
      quantity: 2,
      subtotal: 2000,
      __v: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
};

describe("TrackOrderPage", () => {
  it("shows the cart-equivalent delivery fee, tax, and total", () => {
    useOrderSSEMock.mockReturnValue({
      liveStatus: null,
      isConnected: false,
    });
    useOrderDetailsDataMock.mockReturnValue({
      orderDetail: order,
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={[`/track?orderId=${order._id}`]}>
        <TrackOrderPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Delivery Fee")).toBeInTheDocument();
    expect(screen.getByText("Tax (8%)")).toBeInTheDocument();
    expect(screen.getByText("$2.99")).toBeInTheDocument();
    expect(screen.getByText("$1.60")).toBeInTheDocument();
    expect(screen.getByText("$24.59")).toBeInTheDocument();
  });
});
