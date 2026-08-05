import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, getOrderDetails, getOrders } from "./orders.service";
import { defaultOptions } from "../react.query.config";

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

export const useOrderDetailsData = (id: string) => {
  const ordersQuery = useQuery({
    queryKey: ["order-details", id],
    queryFn: () => getOrderDetails(id),
    enabled: !!id,
  });

  return {
    orderDetail: ordersQuery.data || null,
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
  };
};
