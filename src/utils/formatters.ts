import { Icon, Color } from "@raycast/api";

export function formatTokenBalance(balance: number, decimals: number): string {
  return balance.toFixed(Math.min(decimals, 6));
}

export function validateSolanaAddress(address: string): { isValid: boolean; error?: string } {
  if (!address) {
    return { isValid: false, error: "Address is required." };
  }
  if (address.length < 32 || address.length > 44) {
    return { isValid: false, error: "Invalid address length (must be 32-44 chars)." };
  }
  if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(address)) {
    return { isValid: false, error: "Address contains invalid Base58 characters." };
  }
  return { isValid: true };
}

export function validateTokenAmount(
  amount: string,
  tokenDecimals: number,
  tokenSymbol: string,
): { isValid: boolean; error?: string } {
  if (!amount) {
    return { isValid: false, error: "Amount is required." };
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return { isValid: false, error: "Amount must be a positive number." };
  }

  const parts = amount.split(".");
  if (parts.length > 1 && parts[1].length > tokenDecimals) {
    return {
      isValid: false,
      error: `Amount cannot have more than ${tokenDecimals} decimal places for ${tokenSymbol}.`,
    };
  }

  return { isValid: true };
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function getTokenIcon(symbol: string): { source: Icon; tintColor?: Color } {
  switch (symbol.toUpperCase()) {
    case "SOL":
      return { source: Icon.Coin, tintColor: Color.Purple };
    case "USDC":
      return { source: Icon.Coin, tintColor: Color.Blue };
    case "JITOSOL":
      return { source: Icon.Coin, tintColor: Color.Orange };
    case "VINE":
      return { source: Icon.Leaf, tintColor: Color.Green };
    case "PUDGY":
      return { source: Icon.Star, tintColor: Color.Yellow };
    case "SEND":
      return { source: Icon.Coin, tintColor: Color.Red };
    default:
      return { source: Icon.Coin, tintColor: Color.SecondaryText };
  }
}

export function formatSolanaAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}