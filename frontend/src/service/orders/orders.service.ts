import { OrderPayload, OrderReal, OrderStatus } from "@/utils/types";
import apiClient from "../axios";

export const getOrders = async (): Promise<OrderReal[]> => {
  try {
    const response = await apiClient.get("/order/6a72e76134a85d2ce710053e");

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (payload: OrderPayload) => {
  try {
    const response = await apiClient.post("/order/place", payload);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetails = async (
  id?: string,
): Promise<OrderReal | null> => {
  try {
    if (id) {
      const response = await apiClient.get(`/order/details/${id}`);
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
): Promise<OrderReal> => {
  try {
    const response = await apiClient.put(`/order/${id}`, { status });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
