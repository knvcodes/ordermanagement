import apiClient from "../axios";

export const getOrders = async () => {
  const response = await apiClient.get("/order/6a72e76134a85d2ce710053e");

  return response.data.data;
};

export const createOrder = async (payload: any) => {
  const response = await apiClient.post("/order", payload);

  return response.data;
};
