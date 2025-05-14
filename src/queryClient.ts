import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // Consider data stale after 30 seconds
      gcTime: 300000, // Keep unused data in cache for 5 minutes
      retry: 2, // Retry failed requests twice
    },
  },
});
