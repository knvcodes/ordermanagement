import { useInfiniteQuery } from "@tanstack/react-query";
import { defaultOptions } from "../react.query.config";
import { getMenu } from "./menu.service";
import { MenuApiResponse, MenuListParams } from "@/utils/types";

export const useMenuData = ({
  limit = 10,
  search,
  category,
}: Omit<MenuListParams, "page">) => {
  const menusQuery = useInfiniteQuery<MenuApiResponse>({
    queryKey: ["menu", { limit, search, category }],
    queryFn: ({ pageParam = 1 }) =>
      getMenu(Number(pageParam), limit, category, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // ✅ Use the API's hasNext flag — much more reliable than checking array length
      if (lastPage?.data?.hasNext) {
        return allPages.length + 1;
      }
      return undefined;
    },
    ...defaultOptions,
  });

  // ✅ Flatten all pages' data.data arrays into a single list
  const list =
    menusQuery.data?.pages.flatMap((page) => page?.data?.data || []) ?? [];

  return {
    list,
    isLoading: menusQuery.isLoading,
    isFetchingNextPage: menusQuery.isFetchingNextPage,
    fetchNextPage: menusQuery.fetchNextPage,
    hasNextPage: menusQuery.hasNextPage,
    error: menusQuery.error,
  };
};
