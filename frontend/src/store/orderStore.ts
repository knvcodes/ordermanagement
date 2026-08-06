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
          status: "DELIVERED",
          createdAt: new Date().toISOString(),
          totalAmount,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
        }));

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
