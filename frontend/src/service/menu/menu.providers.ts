import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultOptions } from "../react.query.config";
import { createOrder, getOrders } from "./menu.service";

export const useOrderData = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    ...defaultOptions,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,

    createOrder: createOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
  };
};
