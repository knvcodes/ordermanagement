import { useCallback } from "react";
import { useOrderStore } from "@/store/orderStore";
import type { CartItem, DeliveryInfo, Order, OrderStatus } from "@/utils/types";

export interface UseOrderReturn {
  orders: Order[];
  currentOrder: Order | null;
  orderCount: number;
  placeOrder: (cartItems: CartItem[], deliveryInfo: DeliveryInfo) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  isOrderActive: (order: Order) => boolean;
}

export function useOrder(): UseOrderReturn {
  const orders = useOrderStore((state) => state.orders);
  const currentOrder = useOrderStore((state) => state.currentOrder);
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((order) => order.id === orderId),
    [orders],
  );

  const isOrderActive = useCallback(
    (order: Order) => order.status !== "delivered",
    [],
  );

  return {
    orders,
    currentOrder,
    orderCount: orders.length,
    placeOrder,
    updateOrderStatus,
    getOrderById,
    isOrderActive,
  };
}
