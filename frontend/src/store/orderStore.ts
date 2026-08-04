import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  DeliveryInfo,
  Order,
  OrderStatus,
} from "../utils/types";
import { generateOrderId } from "../utils/helpers";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (cartItems: CartItem[], deliveryInfo: DeliveryInfo) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (id: string) => Order | undefined;
}

const simulateStatusProgression = (
  orderId: string,
  updateStatus: (id: string, status: OrderStatus) => void,
) => {
  setTimeout(() => updateStatus(orderId, "preparing"), 3000);
  setTimeout(() => updateStatus(orderId, "out_for_delivery"), 8000);
  setTimeout(() => updateStatus(orderId, "delivered"), 15000);
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      placeOrder: (cartItems, deliveryInfo) => {
        const totalAmount = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        const newOrder: Order = {
          id: generateOrderId(),
          items: cartItems,
          deliveryInfo,
          status: "received",
          createdAt: new Date().toISOString(),
          totalAmount,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
        }));

        simulateStatusProgression(newOrder.id, get().updateOrderStatus);

        return newOrder;
      },

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o,
          ),
          currentOrder:
            state.currentOrder?.id === orderId
              ? { ...state.currentOrder, status }
              : state.currentOrder,
        })),

      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "food-delivery-orders" },
  ),
);
