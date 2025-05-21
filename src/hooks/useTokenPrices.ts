import { useMemo } from "react";
import { useTokenPrice } from "./useTokenPrice";
import { KNOWN_TOKENS } from "../constants";

const KNOWN_TOKEN_MINTS = {
  USDC: Object.keys(KNOWN_TOKENS).find((k) => KNOWN_TOKENS[k].symbol === "USDC")!,
  JITOSOL: Object.keys(KNOWN_TOKENS).find((k) => KNOWN_TOKENS[k].symbol === "JitoSOL")!,
  VINE: Object.keys(KNOWN_TOKENS).find((k) => KNOWN_TOKENS[k].symbol === "VINE")!,
  PUDGY: Object.keys(KNOWN_TOKENS).find((k) => KNOWN_TOKENS[k].symbol === "PENGU")!,
  SEND: Object.keys(KNOWN_TOKENS).find((k) => KNOWN_TOKENS[k].symbol === "SEND")!,
} as const;

export function useTokenPrices(tokenBalances: Array<{ mintAddress: string }>) {
  const usdcPrice = useTokenPrice(KNOWN_TOKEN_MINTS.USDC);
  const jitoSolPrice = useTokenPrice(KNOWN_TOKEN_MINTS.JITOSOL);
  const vinePrice = useTokenPrice(KNOWN_TOKEN_MINTS.VINE);
  const pudgyPrice = useTokenPrice(KNOWN_TOKEN_MINTS.PUDGY);
  const sendPrice = useTokenPrice(KNOWN_TOKEN_MINTS.SEND);

  const tokenPrices = useMemo(() => {
    const prices: Record<string, { price: number; priceChange24h: number; isLoading: boolean }> = {};

    tokenBalances.forEach((token) => {
      switch (token.mintAddress) {
        case KNOWN_TOKEN_MINTS.USDC:
          prices[token.mintAddress] = usdcPrice;
          break;
        case KNOWN_TOKEN_MINTS.JITOSOL:
          prices[token.mintAddress] = jitoSolPrice;
          break;
        case KNOWN_TOKEN_MINTS.VINE:
          prices[token.mintAddress] = vinePrice;
          break;
        case KNOWN_TOKEN_MINTS.PUDGY:
          prices[token.mintAddress] = pudgyPrice;
          break;
        case KNOWN_TOKEN_MINTS.SEND:
          prices[token.mintAddress] = sendPrice;
          break;
        default:
          prices[token.mintAddress] = { price: 0, priceChange24h: 0, isLoading: false };
      }
    });

    return prices;
  }, [tokenBalances, usdcPrice, jitoSolPrice, vinePrice, pudgyPrice, sendPrice]);

  const isLoading =
    usdcPrice.isLoading || jitoSolPrice.isLoading || vinePrice.isLoading || pudgyPrice.isLoading || sendPrice.isLoading;

  return { tokenPrices, isLoading };
}
