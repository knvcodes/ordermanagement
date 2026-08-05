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

  // ✅ Only send search if it actually has a value
  if (search != null && search !== "") {
    params.search = search;
  }

  // ✅ Only send category if it exists AND is not the default "All"
  // (Adjust "All" if your backend uses a different default like empty string or null)
  if (category && category !== "All") {
    params.category = category;
  }

  const response = await apiClient.get<MenuApiResponse>("/menu/list", {
    params,
  });

  console.info("response.data:===>", response.data);

  return response.data;
};
