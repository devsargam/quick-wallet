export const SOLANA_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
export const USER_WALLET_ADDRESS_KEY = "userSolanaWalletAddress";
export const USER_WALLET_ADDRESSES_KEY = "userSolanaWalletAddresses";
export const ACTIVE_WALLET_ADDRESS_KEY = "activeWalletAddress";
export const SPL_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export const KNOWN_TOKENS: Record<string, { symbol: string; name: string; decimals?: number; coingeckoId?: string }> = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    coingeckoId: "usd-coin",
  },
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: {
    symbol: "JitoSOL",
    name: "Jito Staked SOL",
    decimals: 9,
    coingeckoId: "jito-staked-sol",
  },
  "6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump": {
    symbol: "VINE",
    name: "Vine Coin",
    decimals: 6,
    coingeckoId: "vine",
  },
  "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv": {
    symbol: "PENGU",
    name: "Pudgy Penguins",
    decimals: 6,
    coingeckoId: "pudgy-penguins",
  },
  SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa: {
    symbol: "SEND",
    name: "Sendcoin",
    decimals: 6,
    coingeckoId: "send-2",
  },
};
