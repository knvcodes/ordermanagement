import apiClient from "../axios";

export const getMenu = async () => {
  const response = await apiClient.get("/menu/list");

  return response.data.data;
};
