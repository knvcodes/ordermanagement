export const defaultOptions = {
  // Data stays fresh for 30 seconds
  staleTime: 1000 * 30,

  // Keep unused cache for 5 minutes
  gcTime: 1000 * 60 * 5,

  // Retry failed requests twice
  retry: 2,

  // Don't refetch every time user switches tab
  refetchOnWindowFocus: false,

  // Refetch when network reconnects
  refetchOnReconnect: true,
};
