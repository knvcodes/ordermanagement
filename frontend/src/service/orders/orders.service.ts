import { OrderPayload, OrderReal } from "@/utils/types";
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
