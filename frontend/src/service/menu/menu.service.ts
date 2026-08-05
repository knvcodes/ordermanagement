import { MenuApiResponse, MenuListParams } from "@/utils/types";
import apiClient from "../axios";

export const getMenu = async (
  page: number = 1,
  limit: number = 10,
  category: string,
  search?: string,
): Promise<MenuApiResponse> => {
  const params: MenuListParams = {
    category,
  };

  if (page != null) params.page = page;
  if (limit != null) params.limit = limit;

  if (search != null && search !== "") {
    params.search = search;
  }

  if (category && category !== "All") {
    params.category = category;
  }

  const response = await apiClient.get<MenuApiResponse>("/menu/list", {
    params,
  });

  return response.data;
};
