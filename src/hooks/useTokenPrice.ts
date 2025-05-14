import { useQuery } from "@tanstack/react-query";
import { KNOWN_TOKENS } from "../constants";

interface TokenPriceData {
  price: number;
  priceChange24h: number;
}

async function fetchTokenPrice(mintAddress: string): Promise<TokenPriceData> {
  const tokenInfo = KNOWN_TOKENS[mintAddress];
  const coingeckoId = tokenInfo?.coingeckoId;
  if (!coingeckoId) {
    return { price: 0, priceChange24h: 0 };
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd&include_24hr_change=true`,
    );

    if (!response.ok) {
      console.error(`CoinGecko API error for ${coingeckoId}: ${response.status} ${response.statusText}`);
      return { price: 0, priceChange24h: 0 };
    }

    const data = await response.json();

    if (!data[coingeckoId]) {
      console.warn(`No price data available for token ${mintAddress} (${coingeckoId})`);
      return { price: 0, priceChange24h: 0 };
    }

    const price = data[coingeckoId].usd;
    const priceChange = data[coingeckoId].usd_24h_change;

    if (typeof price !== "number" || isNaN(price)) {
      console.warn(`Invalid price data for ${coingeckoId}:`, data[coingeckoId]);
      return { price: 0, priceChange24h: 0 };
    }

    return {
      price: price || 0,
      priceChange24h: typeof priceChange === "number" ? priceChange : 0,
    };
  } catch (error) {
    console.error(`Failed to fetch price for token ${mintAddress}:`, error);
    return { price: 0, priceChange24h: 0 };
  }
}

export function useTokenPrice(mintAddress: string) {
  const tokenInfo = KNOWN_TOKENS[mintAddress];
  const coingeckoId = tokenInfo?.coingeckoId;
  const {
    data: priceData = { price: 0, priceChange24h: 0 },
    isLoading,
    error,
  } = useQuery<TokenPriceData, Error>({
    queryKey: ["tokenPrice", mintAddress],
    queryFn: () => fetchTokenPrice(mintAddress),
    enabled: !!mintAddress && !!coingeckoId,
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 5000, // Consider data stale after 5 seconds
    gcTime: 300000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    price: priceData.price,
    priceChange24h: priceData.priceChange24h,
    isLoading,
    error: error ? error.message : null,
  };
}
