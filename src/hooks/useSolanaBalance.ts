import { useQuery } from "@tanstack/react-query";
import { fetchSolanaBalance } from "../services/solana";
import { UseSolanaBalanceReturn } from "../types";
import { useGlobalQueryClient } from ".";

export function useSolanaBalance(walletAddress: string): UseSolanaBalanceReturn {
  const queryClient = useGlobalQueryClient();

  const {
    data: balance,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<number, Error>({
    queryKey: ["solanaBalance", walletAddress],
    queryFn: () => fetchSolanaBalance(walletAddress),
    enabled: !!walletAddress,
    refetchInterval: 60000, // Refetch every 1 minute
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    gcTime: 300000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refetch = async () => {
    const previousData = queryClient.getQueryData<number>(["solanaBalance", walletAddress]);
    if (previousData !== undefined) {
      queryClient.setQueryData(["solanaBalance", walletAddress], previousData);
    }
    await queryRefetch();
  };

  return {
    balance: balance ?? null,
    isLoading,
    error: error ? error.message : null,
    refetch,
  };
}
