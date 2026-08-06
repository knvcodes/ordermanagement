import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useOrderStore } from "@/store/orderStore";
import type { CartItem, DeliveryInfo } from "@/utils/types";

const cartItems: CartItem[] = [
  {
    _id: "burger-001",
    name: "Classic Burger",
    description: "Beef patty with lettuce and tomato",
    price: 1000,
    category: "Burger",
    image: "/images/burger.jpg",
    quantity: 2,
    isAvailable: false,
    __v: 0,
    createdAt: "",
    updatedAt: "",
  },
];

const deliveryInfo: DeliveryInfo = {
  name: "John Doe",
  address: "123 Main Street, Springfield",
  phone: "+1 555-123-4567",
};

describe("orderStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useOrderStore.setState({ orders: [], currentOrder: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("places an order with received status and sets it as current", () => {
    const order = useOrderStore.getState().placeOrder(cartItems, deliveryInfo);

    expect(order.status).toBe("received");
    expect(useOrderStore.getState().orders).toHaveLength(1);
    expect(useOrderStore.getState().currentOrder?.id).toBe(order.id);
    expect(order.totalAmount).toBeGreaterThan(0);
  });

  it("progresses the order status through all stages over time", () => {
    useOrderStore.getState().placeOrder(cartItems, deliveryInfo);

    expect(useOrderStore.getState().orders[0].status).toBe("received");

    vi.advanceTimersByTime(3000);
    expect(useOrderStore.getState().orders[0].status).toBe("preparing");

    vi.advanceTimersByTime(5000);
    expect(useOrderStore.getState().orders[0].status).toBe("out_for_delivery");

    vi.advanceTimersByTime(7000);
    expect(useOrderStore.getState().orders[0].status).toBe("delivered");
  });
});
