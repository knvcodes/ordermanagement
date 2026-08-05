import { useQuery } from "@tanstack/react-query";
import { defaultOptions } from "../react.query.config";
import { getMenu } from "./menu.service";

export const useMenuData = () => {
  const menusQuery = useQuery({
    queryKey: ["menu"],
    queryFn: getMenu,
    ...defaultOptions,
  });

  return {
    list: menusQuery.data ?? [],
    isLoading: menusQuery.isLoading,
    error: menusQuery.error,
  };
};
